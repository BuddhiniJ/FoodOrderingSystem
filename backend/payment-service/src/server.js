const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const cors = require("cors");

// Route imports
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend Vite URL
    credentials: true,
  })
);

// DB connection
connectDB();

// Routes
app.use("/api/payments", paymentRoutes);

const PORT = process.env.PORT || 5006;
app.listen(PORT, () => console.log(`Payment service running on port ${PORT}`));
