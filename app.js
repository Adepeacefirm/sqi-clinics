const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
const morgan = require("morgan");
app.use(cors());
app.use(morgan("dev"));

const authRoute = require("./routes/authRoute");
const usersRoute = require("./routes/userRoute");
const doctorsRoute = require("./routes/doctorRoute");
const appointmentRoute = require("./routes/appointmentRoute");
const adminRoute = require("./routes/adminRoute");
const paymentRoute = require("./routes/paymentRoute");

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/doctors", doctorsRoute);
app.use("/appointments", appointmentRoute);
app.use("/api/admin", adminRoute);
app.use("/payments", paymentRoute);

module.exports = app;
