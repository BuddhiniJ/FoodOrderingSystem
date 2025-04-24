// 📁 /delivery-service/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const deliveryRoutes = require('./Routes/delivery');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.json());
app.use('/api/delivery', deliveryRoutes);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('location-update', (data) => {
    io.emit('location-tracking', data); // Broadcast live location
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    server.listen(5005, () => console.log('Server running on http://localhost:5005'));
  })
  .catch(err => console.log(err));
