import { eventData } from "../model/eventModel.js";

/* ================= CREATE EVENT ================= */
export const addEvent = async (req, res) => {
    try {
        const event = await eventData.create({
            ...req.body,
            createdBy: req.user.id,
        });
        res.status(201).json({ message: "Event created successfully", event });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/* ================= GET ALL EVENTS ================= */
export const getEvents = async (req, res) => {
    try {
        const events = await eventData.find().sort({ date: 1 });
        res.status(200).json(events);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/* ================= EDIT EVENT ================= */
export const editEvent = async (req, res) => {
    try {
        const event = await eventData.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!event) return res.status(404).json({ message: "Event not found" });
        res.status(200).json({ message: "Event updated successfully", event });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/* ================= DELETE EVENT ================= */
export const deleteEvent = async (req, res) => {
    try {
        const event = await eventData.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
