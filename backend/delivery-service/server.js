const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./Config/db'); // Import the database connection function
const http = require('http');

// Initialize app first
const app = express();

// Then create the server
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: "*" } });

app.set('io', io);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
});

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const locationRoutes = require('./Routes/delivery');
const assignmentRoutes = require('./Routes/deliveryAssignment');

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Set security headers
app.use(helmet());

// Dev logging middleware
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

const PORT = process.env.PORT || 5005;

server.listen(PORT, () => { // <-- use 'server.listen' instead of 'app.listen'
  console.log(`Server running on port ${PORT}`);
});
