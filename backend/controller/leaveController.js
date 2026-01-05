import { leaveData } from "../model/leaveModel.js";
import { holidayData } from "../model/holidayModel.js";

/* ================= USER / ADMIN APPLY LEAVE ================= */
export const applyLeave = async (req, res) => {
  try {
    const { reason, from_date, to_date } = req.body;

    if (!reason || !from_date || !to_date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const startDate = new Date(from_date);
    const endDate = new Date(to_date);

    if (startDate > endDate) {
      return res
        .status(400)
        .json({ message: "'From' date cannot be after 'To' date" });
    }

    // 1️⃣ Generate all dates in the range
    const dates = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      // 2️⃣ Check for Saturday or Sunday
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return res.status(400).json({
          message: `Cannot apply leave on weekend: ${d.toDateString()}`,
        });
      }
      dates.push(new Date(d));
    }

    // 3️⃣ Check holidays
    const holidays = await holidayData.find();
    for (let date of dates) {
      if (holidays.some(h => new Date(h.date).toDateString() === date.toDateString())) {
        return res.status(400).json({
          message: `Cannot apply leave on holiday: ${date.toDateString()}`,
        });
      }
    }

    // 4️⃣ Determine leave status
    let status = "pending"; // default for regular users
    if (req.user.role === "admin") {
      status = "approved"; // automatically approved for Admin self leave
    }

    // ✅ Create leave
    const leave = await leaveData.create({
      user_id: req.user.id,
      reason,
      from_date: startDate,
      to_date: endDate,
      status,
    });

    res.status(201).json({
      message:
        req.user.role === "admin"
          ? "Leave applied successfully and automatically approved by Super Admin"
          : "Leave applied successfully",
      leave,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= USER VIEW OWN LEAVES ================= */
export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await leaveData.find({ user_id: req.user.id });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= ADMIN PROCESS LEAVE ================= */
export const processLeave = async (req, res) => {
  try {
    const leave = await leaveData.findByIdAndUpdate(
      req.params.id,
      { status: "processed" },
      { new: true }
    );

    res.status(200).json({
      message: "Leave processed by Admin",
      leave,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= SUPER ADMIN APPROVE / REJECT ================= */
export const approveRejectLeave = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be approved or rejected",
      });
    }

    const leave = await leaveData.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.status(200).json({
      message: `Leave ${status} successfully`,
      leave,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= ADMIN & SUPER ADMIN VIEW ================= */
export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await leaveData
      .find()
      .populate("user_id", "name email");

    res.status(200).json(leaves);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
