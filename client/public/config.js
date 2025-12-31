// Runtime configuration
// Update the SOCKET_URL below with your deployed backend URL
window.ENV = {
  // For production: Use your deployed backend URL
  // For local development: Comment out or use 'http://localhost:3001'
  SOCKET_URL: window.location.hostname === 'localhost'
    ? 'http://localhost:3001'
    : 'https://anonchat-server-xibu.onrender.com'
};
