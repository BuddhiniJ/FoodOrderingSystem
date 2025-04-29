const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./Config/db');
const http = require('http');

// Load env vars
dotenv.config();

// Initialize app
const app = express();

// Create the server
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: '*' } });

// Attach io instance to app for later use
app.set('io', io);

// Handle socket connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
});

// Connect to database
connectDB();

// Import route files
const locationRoutes = require('./Routes/delivery');
const assignmentRoutes = require('./Routes/deliveryAssignment');

// Middlewares
app.use(express.json()); // Body parser
app.use(cors()); // Enable CORS
app.use(helmet()); // Set security headers

// Logging middleware in development only
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/location', locationRoutes);
app.use('/api/assignments', assignmentRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Delivery Service API' });
});

// Set PORT
const PORT = process.env.PORT || 5005;

// Start server
server.listen(PORT, () => {
  console.log(`🚚 Delivery Service running on port ${PORT}`);
});
