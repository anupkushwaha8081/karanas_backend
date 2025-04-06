const express = require("express");
const app = express();
app.use(express.json());

require("dotenv").config();

const cors = require("cors");

// CORS options
const corsOptions = {
  origin: process.env.CLIENTS_URI,
  methods: ["GET", "POST", "DELETE", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));






// Import and connect to the database
const { dbConnect } = require("./config/database");
dbConnect();

//routes configuration
const authRoutes = require("./routes/auth-routes")
const instructorroutes = require("./routes/instructor-routes")
const studentroutes =require("./routes/student-routes")
const adminroutes = require("./routes/admin-routes")
app.use("/auth", authRoutes);
app.use("/instructor", instructorroutes);
app.use("/student", studentroutes);
app.use("/admin", adminroutes);

// Define routes
app.get("/", (req, res) => {
  res.send("Hello ji");
});
//http://localhost:3096/auth/register

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
