const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const networkRoutes = require("./routes/networkRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Test API Working" });
});

// Network routes
app.use("/api/network", networkRoutes);

app.get("/", (req, res) => {
  res.send("Network Connection Checker Backend is Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});