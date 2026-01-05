import express from "express";
import { getCalendarEvents } from "../controller/calendarController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* GET calendar events for all roles */
router.get("/", protect, getCalendarEvents);

export default router;
