import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';
import { generateRandomName, validateName } from './nameGenerator';

const SOCKET_URL = window.ENV?.SOCKET_URL || process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';

function App() {
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState('disconnected');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [userName, setUserName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [nameError, setNameError] = useState('');
  const [showNameForm, setShowNameForm] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const savedName = localStorage.getItem('anonChatUserName');
    if (savedName) {
      setUserName(savedName);
    } else {
      setShowNameForm(true);
    }
  }, []);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('waiting', () => {
      setStatus('waiting');
      setMessages([{ type: 'system', text: 'Looking for someone to chat with...' }]);
    });

    newSocket.on('partnerFound', (data) => {
      setStatus('connected');
      setPartnerName(data.partnerName);
      setMessages([{ type: 'system', text: `${data.partnerName} connected! Say hi.` }]);
    });

    newSocket.on('receiveMessage', (data) => {
      setMessages(prev => [...prev, { type: 'received', text: data.message }]);
      setIsPartnerTyping(false);
    });

    newSocket.on('partnerTyping', () => {
      setIsPartnerTyping(true);
    });

    newSocket.on('partnerStoppedTyping', () => {
      setIsPartnerTyping(false);
    });

    newSocket.on('partnerDisconnected', () => {
      setStatus('disconnected');
      setPartnerName('');
      setMessages(prev => [...prev, { type: 'system', text: 'Stranger disconnected.' }]);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleGenerateName = () => {
    const randomName = generateRandomName();
    setNameInput(randomName);
    setNameError('');
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    const name = nameInput.trim() || generateRandomName();
    const error = validateName(name);

    if (error) {
      setNameError(error);
      return;
    }

    setUserName(name);
    localStorage.setItem('anonChatUserName', name);
    setNameError('');
    setShowNameForm(false);
    startChat(name);
  };

  const startChat = (name) => {
    const nameToUse = name || userName;
    if (socket && nameToUse) {
      socket.emit('findPartner', { userName: nameToUse });
      setMessages([]);
    }
  };

  const endChat = () => {
    if (socket) {
      socket.emit('endChat');
      setStatus('disconnected');
      setPartnerName('');
      setMessages([{ type: 'system', text: 'You disconnected.' }]);
    }
  };

  const handleNewChat = () => {
    if (userName) {
      startChat(userName);
    }
  };

  const handleChangeName = () => {
    setShowNameForm(true);
    setNameInput('');
    setNameError('');
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && socket && status === 'connected') {
      socket.emit('sendMessage', { message: inputMessage });
      setMessages(prev => [...prev, { type: 'sent', text: inputMessage }]);
      setInputMessage('');
      socket.emit('stopTyping');
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);

    if (socket && status === 'connected') {
      socket.emit('typing');

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stopTyping');
      }, 1000);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>AnonChat</h1>
        <p className="tagline">Chat anonymously with random strangers</p>
      </header>

      <div className="chat-container">
        <div className="status-bar">
          <div className={`status-indicator ${status}`}>
            {status === 'disconnected' && !userName && 'Enter name to start'}
            {status === 'disconnected' && userName && !showNameForm && `You are: ${userName}`}
            {status === 'waiting' && `Finding stranger... (You: ${userName})`}
            {status === 'connected' && `Chatting with ${partnerName}`}
          </div>
          <div className="actions">
            {status === 'disconnected' && userName && !showNameForm && (
              <>
                <button onClick={handleNewChat} className="btn btn-primary">
                  New Chat
                </button>
                <button onClick={handleChangeName} className="btn btn-secondary">
                  Change Name
                </button>
              </>
            )}
            {(status === 'waiting' || status === 'connected') && (
              <button onClick={endChat} className="btn btn-danger">
                End Chat
              </button>
            )}
          </div>
        </div>

        <div className="messages-container">
          {showNameForm && status === 'disconnected' && (
            <div className="welcome-message">
              <h2>{userName ? 'Change Your Name' : 'Welcome to AnonChat'}</h2>
              <p>Enter a pseudo name or generate one to start chatting</p>
              <form onSubmit={handleNameSubmit} className="name-form">
                <div className="name-input-group">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Enter your name..."
                    className="name-input"
                    maxLength={20}
                  />
                  <button type="button" onClick={handleGenerateName} className="btn btn-generate">
                    Generate
                  </button>
                </div>
                {nameError && <p className="error-message">{nameError}</p>}
                <button type="submit" className="btn btn-primary btn-large">
                  {userName ? 'Save & Start Chat' : 'Start Chat'}
                </button>
              </form>
              {!userName && (
                <ul className="info-list">
                  <li>No registration required</li>
                  <li>Completely anonymous</li>
                  <li>One-on-one text chat</li>
                  <li>No chat history saved</li>
                </ul>
              )}
            </div>
          )}

          {!showNameForm && messages.length === 0 && status === 'disconnected' && userName && (
            <div className="welcome-message">
              <h2>Welcome back, {userName}!</h2>
              <p>Click "New Chat" to connect with a random stranger</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.type}`}>
              <span className="message-label">
                {msg.type === 'sent' && `${userName}: `}
                {msg.type === 'received' && `${partnerName}: `}
              </span>
              <span className="message-text">{msg.text}</span>
            </div>
          ))}

          {isPartnerTyping && (
            <div className="typing-indicator">
              <span>{partnerName} is typing</span>
              <span className="dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {status === 'connected' && (
          <form onSubmit={sendMessage} className="input-container">
            <input
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="message-input"
              autoFocus
            />
            <button type="submit" className="btn btn-send" disabled={!inputMessage.trim()}>
              Send
            </button>
          </form>
        )}
      </div>

      <footer className="footer">
        <p>Remember: Be respectful and kind to strangers</p>
      </footer>
    </div>
  );
}

export default App;
