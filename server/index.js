const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const requestIp = require("request-ip");
const os = require("os");

require("dotenv").config();
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',')
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(requestIp.mw());
// Allowed IPs (add your specific IP here)
const allowedIPs = ["192.168.0.107"]; // Replace with your specific IP address

const getServerIPv4 = () => {
  const interfaces = os.networkInterfaces();
  console.log(interfaces);
  for (const interfaceName in interfaces) {
    for (const address of interfaces[interfaceName]) {
      if (address.family === "IPv4" && !address.internal) {
        return address.address; // Return the first external IPv4 address found
      }
    }
  }
  return null; // Return null if no external IPv4 address is found
};

// Middleware to check if IP is allowed
const ipFilter = (req, res, next) => {
  const clientIp = getServerIPv4(); // Get client's IP address
  console.log(`Client IP: ${clientIp}`);

  if (allowedIPs.includes(clientIp)) {
    next(); // IP is allowed, proceed
  } else {
    res.status(501).send("Access Denied: Unauthorized IP"); // Block access
  }
};

// Apply the IP filter middleware to all routes
// app.use(ipFilter);

//Routes
const studentRoutes = require("./routes/student.route");
const adminRoutes = require("./routes/admin.route");
const teacherRoutes = require("./routes/teacher.route");
const loginRoutes = require("./routes/login.route");
const principalRoutes = require("./routes/principal.route");
const { changePassword, checkUserForReset, resetPasswordConfirm } = require("./controllers/changePassword.controller");

const {
  verifyToken,
  isAdmin,
  isStudent,
  isTeacher,
  isprincipal,
} = require("./middlewares/authorization");

//mongDB connection
const mongoose = require("mongoose");
//mongoose.connect(process.env.MONGODB_URL)
//For localhost uncomment the below line and comment above line***
mongoose
  .connect("mongodb://127.0.0.1:27017/niepid1")
  .then((res) => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// //Routes

app.use("/login", loginRoutes);
app.use("/student", verifyToken, isStudent, studentRoutes);
app.use("/teacher", verifyToken, isTeacher, teacherRoutes);
app.use("/principal", verifyToken, isprincipal, principalRoutes);
app.use("/admin", verifyToken, isAdmin, adminRoutes);
app.post("/api/changepassword", changePassword);
app.post("/api/checkUserForReset", checkUserForReset)
app.post("/api/resetPasswordConfirm", resetPasswordConfirm)

app.get("/", (req, res) => {
  res.status(200).send("hello page");
});

//server connection
app.listen(4000, () => {
  console.log(`server is listening at port 4000`);
  console.log("And from: ", allowedOrigins)
});