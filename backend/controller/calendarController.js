import { leaveData } from "../model/leaveModel.js";
import { holidayData } from "../model/holidayModel.js";
import { adminUsersData } from "../model/adminModel.js"; // To get user name/email

export const getCalendarEvents = async (req, res) => {
  try {
    // 1️⃣ Fetch all holidays
    const holidays = await holidayData.find();
    const holidayEvents = holidays.map(h => ({
      title: h.title,
      start: h.date,
      end: h.date,
      type: "holiday",
      color: "green",
    }));

    // 2️⃣ Fetch leaves based on role
    let leaves = [];
    if (req.user.role === "user") {
      // User sees only their own leaves
      leaves = await leaveData.find({ user_id: req.user.id });
    } else if (req.user.role === "admin") {
      // Admin sees their own leave + all users leaves, exclude other admins
      const allLeaves = await leaveData.find().populate("user_id", "name role email");
      leaves = allLeaves.filter(
        l => l.user_id._id.toString() === req.user.id || l.user_id.role === "user"
      );
    } else if (req.user.role === "superadmin") {
      // Super Admin sees all leaves
      leaves = await leaveData.find().populate("user_id", "name role email");
    }

    const leaveEvents = leaves.map(l => ({
      title:
        l.user_id._id.toString() === req.user.id
          ? "Your Leave – " + l.reason
          : `${l.user_id.name} – ${l.reason}`,
      start: l.from_date,
      end: l.to_date,
      status: l.status, // pending / processed / approved / rejected
      type: "leave",
      color:
        l.status === "pending"
          ? "orange"
          : l.status === "processed"
          ? "blue"
          : l.status === "approved"
          ? "green"
          : "red",
    }));

    // 3️⃣ Merge events
    const events = [...holidayEvents, ...leaveEvents];

    res.status(200).json(events);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
