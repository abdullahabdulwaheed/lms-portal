import express from "express";
import cors from "cors";
import adminRoutes from "./routes/adminRoute.js";
import userRotes from "./routes/userRoute.js";
import teamsRoute from "./routes/teamRoute.js";
import connectDB from "./lib/db.js";
import leaveRoutes from "./routes/leaveRoute.js";
import holidayRoutes from "./routes/holidayRoute.js";
import calendarRoutes from "./routes/calendarRoute.js";
import attendanceRoutes from "./routes/attendanceRoute.js";
import eventRoutes from "./routes/eventRoute.js";

const app = express();
const PORT = 8080;
// KILL PORT CODE => npx kill-port 8080

// Connect DB

connectDB();

app.use(cors({
  origin: ['https://lms-portal-admin.onrender.com', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

// Admin
app.use("/admin", adminRoutes);

// User
app.use("/user", userRotes);

// Team

app.use("/team", teamsRoute);

// Leave
app.use("/leave", leaveRoutes);

// Holiday
app.use("/holiday", holidayRoutes);

// Calendar
app.use("/calendar", calendarRoutes);

// Attendance
app.use("/attendance", attendanceRoutes);

// Event
app.use("/event", eventRoutes);

app.listen(PORT, () => {
  console.log(`The Server is running at the port ${PORT}`);
});
