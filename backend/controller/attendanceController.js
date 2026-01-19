import { attendanceData } from "../model/attendanceModel.js";
import { holidayData } from "../model/holidayModel.js";

/* ================== CHECK-IN ================== */
export const checkIn = async (req, res) => {
  try {
    const now = new Date();
    const dayOfWeek = now.getDay();

    // Check if today is weekend or holiday
    const holidays = await holidayData.find();
    if (dayOfWeek === 0 || dayOfWeek === 6 || holidays.some(h => new Date(h.date).toDateString() === now.toDateString())) {
      return res.status(400).json({ message: "Cannot check-in on weekend or holiday" });
    }

    // Check if already checked-in
    const existing = await attendanceData.findOne({ user_id: req.user.id, date: now.toDateString() });
    if (existing) {
      return res.status(400).json({ message: "Already checked-in today" });
    }

    // Auto checkout time = 9 hours from checkin
    const checkoutTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);

    const attendance = await attendanceData.create({
      user_id: req.user.id,
      checkin_time: now,
      checkout_time: checkoutTime,
      date: now.toDateString(),
    });

    res.status(201).json({ message: "Checked-in successfully", attendance });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================== CHECK-OUT ================== */
export const checkOut = async (req, res) => {
  try {
    const now = new Date();
    const attendance = await attendanceData.findOne({ user_id: req.user.id, date: now.toDateString() });

    if (!attendance) {
      return res.status(400).json({ message: "No check-in found for today" });
    }

    // Update checkout time
    attendance.checkout_time = now;
    await attendance.save();

    res.status(200).json({ message: "Checked-out successfully", attendance });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================== VIEW ATTENDANCE ================== */
export const getAttendance = async (req, res) => {
  try {
    let records = [];

    if (req.user.role === "user") {
      // User sees only own attendance
      records = await attendanceData.find({ user_id: req.user.id });
    } else if (req.user.role === "admin") {
      // Admin sees own + all users attendance
      records = await attendanceData.find().populate("user_id", "name email role");
      // Filter out other admins and handle potential null user_id
      records = records.filter(r => r.user_id && (r.user_id._id.toString() === req.user.id || r.user_id.role === "user"));
    } else if (req.user.role === "superadmin") {
      // Super admin sees all attendance
      records = await attendanceData.find().populate("user_id", "name email role");
    }

    res.status(200).json(records);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
