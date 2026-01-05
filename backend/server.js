import express from "express";
import adminRoutes from "./routes/adminUsers.route.js";
import userRotes from "./routes/users.route.js";
import teamsRoute from "./routes/teams.route.js";
import connectDB from "./lib/db.js";

const app = express();
const PORT = 8080;
// KILL PORT CODE => npx kill-port 8080

// Connect DB

connectDB();

app.use(express.json());

// Admin
app.use("/admin", adminRoutes);

// User
app.use("/user", userRotes);

// Team

app.use("/team", teamsRoute);

app.listen(PORT, () => {
  console.log(`The Server is running at the port ${PORT}`);
});
