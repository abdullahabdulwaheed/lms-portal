import { model, Schema } from "mongoose";

const attendanceSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "adminUsersData", // or "users" depending on role
      required: true,
    },
    checkin_time: {
      type: Date,
      required: true,
    },
    checkout_time: {
      type: Date,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const attendanceData = model("attendanceData", attendanceSchema);
