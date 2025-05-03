require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const http = require('http');
const { Server } = require('socket.io');

connectDB();

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // For dev; restrict in prod
    methods: ['GET', 'POST'],
  },
});

const deliverySockets = new Map();

io.on('connection', (socket) => {
  socket.on('register-delivery', (userId) => {
    deliverySockets.set(userId, socket.id);
    socket.userId = userId;
  });
  socket.on('disconnect', () => {
    if (socket.userId) deliverySockets.delete(socket.userId);
  });
});

module.exports.io = io;
module.exports.deliverySockets = deliverySockets;

const PORT = process.env.PORT || 5002;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  logger.error(`Error: ${err.message}`);
  process.exit(1);
});
