# AnonChat

An anonymous chat application where users can chat with random strangers without creating an account. Built with React and Socket.io.

## Features

- No registration or login required
- Random user pairing
- One-on-one text chat
- Real-time messaging
- Typing indicators
- Mobile responsive design
- No chat history stored
- Simple and clean interface

## Tech Stack

- **Frontend**: React, Socket.io-client
- **Backend**: Node.js, Express, Socket.io
- **Styling**: CSS3 with mobile-first approach

## Project Structure

```
AnonChat/
├── client/              # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── server/              # Node.js backend
│   ├── server.js
│   └── package.json
├── package.json
└── README.md
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm

### Setup

1. Install dependencies for all packages:

```bash
npm run install-all
```

Or install manually:

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## Running the Application

### Development Mode

Run both server and client concurrently:

```bash
npm run dev
```

Or run them separately:

**Terminal 1 - Server:**
```bash
npm run server
```

**Terminal 2 - Client:**
```bash
npm run client
```

The server will run on `http://localhost:3001` and the client on `http://localhost:3000`.

### Testing

To test the chat functionality:

1. Open `http://localhost:3000` in two different browser windows (or use incognito mode)
2. Click "Start Chat" in both windows
3. The two windows should connect to each other
4. Start chatting

## How It Works

### User Flow

1. User visits the website
2. Clicks "Start Chat"
3. System looks for another waiting user
4. If found, pairs them together
5. If not found, user waits until another user clicks "Start Chat"
6. Once paired, users can send messages to each other
7. Either user can click "End Chat" to disconnect
8. Users can start a new chat after disconnecting

### Backend Logic

- Uses Socket.io for WebSocket connections
- Maintains a waiting queue for unpaired users
- When two users are available, pairs them together
- Routes messages between paired users
- Handles disconnections and chat endings
- No data persistence (all in-memory)

## Configuration

### Server Port

The server runs on port 3001 by default. To change it, modify the `PORT` in `server/server.js`:

```javascript
const PORT = process.env.PORT || 3001;
```

### Client Socket URL

If you change the server port, update the socket URL in `client/src/App.js`:

```javascript
const SOCKET_URL = 'http://localhost:3001';
```

## Deployment

### Backend

Deploy the server to any Node.js hosting service (Heroku, Railway, Render, etc.).

Update the `SOCKET_URL` in the client to point to your deployed server URL.

### Frontend

Build the React app:

```bash
cd client
npm run build
```

Deploy the `build` folder to any static hosting service (Netlify, Vercel, GitHub Pages, etc.).

## Future Enhancements (Optional)

- Add language filter
- Add interests/tags for better matching
- Add "Skip" button to find another stranger
- Add spam/abuse reporting
- Add rate limiting
- Add profanity filter

## License

ISC
