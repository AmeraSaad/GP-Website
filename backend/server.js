const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require("path");
const connectDB = require("./db/connectDB");

const crewaiRoutes = require("./routes/crewaiRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 

// Routes
app.use("/api/crewai", crewaiRoutes);

// Serve static files if needed (for production)
// app.use(express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => {
  res.send("Express server is running...");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});