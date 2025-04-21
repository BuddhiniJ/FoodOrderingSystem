const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(require('cors')());

// DB connection
connectDB();

// Routes
app.use('/api/orders', require('./routes/orderRoutes'));

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Order service running on port ${PORT}`));
