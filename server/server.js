const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

let waitingUsers = [];
const activePairs = new Map();
const userNames = new Map();

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  socket.on('findPartner', (data) => {
    const userName = data.userName || 'Anonymous';
    userNames.set(socket.id, userName);

    if (waitingUsers.length > 0) {
      const partner = waitingUsers.shift();
      const partnerName = userNames.get(partner.id) || 'Anonymous';

      activePairs.set(socket.id, partner.id);
      activePairs.set(partner.id, socket.id);

      socket.emit('partnerFound', {
        partnerId: partner.id,
        partnerName: partnerName
      });
      partner.emit('partnerFound', {
        partnerId: socket.id,
        partnerName: userName
      });

      console.log(`Paired: ${userName} (${socket.id}) with ${partnerName} (${partner.id})`);
    } else {
      waitingUsers.push(socket);
      socket.emit('waiting');
      console.log(`User ${userName} (${socket.id}) is waiting for a partner`);
    }
  });

  socket.on('sendMessage', (data) => {
    const partnerId = activePairs.get(socket.id);
    if (partnerId) {
      io.to(partnerId).emit('receiveMessage', {
        message: data.message,
        timestamp: Date.now()
      });
    }
  });

  socket.on('typing', () => {
    const partnerId = activePairs.get(socket.id);
    if (partnerId) {
      io.to(partnerId).emit('partnerTyping');
    }
  });

  socket.on('stopTyping', () => {
    const partnerId = activePairs.get(socket.id);
    if (partnerId) {
      io.to(partnerId).emit('partnerStoppedTyping');
    }
  });

  socket.on('endChat', () => {
    handleDisconnect(socket);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    handleDisconnect(socket);
  });

  function handleDisconnect(socket) {
    const partnerId = activePairs.get(socket.id);
    const userName = userNames.get(socket.id);

    if (partnerId) {
      const partnerName = userNames.get(partnerId);
      io.to(partnerId).emit('partnerDisconnected');
      activePairs.delete(partnerId);
      activePairs.delete(socket.id);
      console.log(`Chat ended between ${userName} (${socket.id}) and ${partnerName} (${partnerId})`);
    }

    const waitingIndex = waitingUsers.findIndex(user => user.id === socket.id);
    if (waitingIndex !== -1) {
      waitingUsers.splice(waitingIndex, 1);
      console.log(`Removed ${userName} (${socket.id}) from waiting list`);
    }

    userNames.delete(socket.id);
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
