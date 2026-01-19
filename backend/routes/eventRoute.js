import express from "express";
import {
    addEvent,
    getEvents,
    editEvent,
    deleteEvent,
} from "../controller/eventController.js";
import { protect, adminOrSuperAdminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Publicly viewable by logged in users
router.get("/view", protect, getEvents);

// Admin / SuperAdmin only CRUD
router.post("/add", protect, adminOrSuperAdminOnly, addEvent);
router.patch("/edit/:id", protect, adminOrSuperAdminOnly, editEvent);
router.delete("/delete/:id", protect, adminOrSuperAdminOnly, deleteEvent);

export default router;
