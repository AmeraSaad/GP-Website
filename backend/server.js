const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require("path");
const connectDB = require("./db/connectDB");

const crewaiRoutes = require("./routes/crewai.routes");
const uiDesignRoutes = require("./routes/uIDesign.routes");
const summaryRoutes = require("./routes/summary.routes");
const minutesRoutes = require("./routes/minutes.routes");
const meetingRoutes = require("./routes/meeting.routes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 

// Routes
app.use("/api/crewai", crewaiRoutes);
app.use("/api/ui-design", uiDesignRoutes);
app.use("/api/summaries", summaryRoutes);
app.use("/api/minutes", minutesRoutes);
app.use("/api/meetings", meetingRoutes);

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