const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(require('cors')());

// DB Connection
connectDB();

// Routes
app.use('/api/restaurants', require('./routes/restaurantRoutes'));

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Restaurant service running on port ${PORT}`));
