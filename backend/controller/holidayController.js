import { holidayData } from "../model/holidayModel.js";

/* ================= ADD HOLIDAY ================= */
export const addHoliday = async (req, res) => {
  try {
    const holiday = await holidayData.create(req.body);
    res.status(201).json({
      message: "Holiday added successfully",
      holiday,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= VIEW HOLIDAYS (ALL USERS) ================= */
export const getHolidays = async (req, res) => {
  try {
    const holidays = await holidayData.find().sort({ date: 1 });
    res.status(200).json(holidays);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= UPDATE HOLIDAY ================= */
export const editHoliday = async (req, res) => {
  try {
    await holidayData.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({ message: "Holiday updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= DELETE HOLIDAY ================= */
export const deleteHoliday = async (req, res) => {
  try {
    await holidayData.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Holiday deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
