import { model, Schema } from "mongoose";

const leaveSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    from_date: {
      type: Date,
      required: true,
    },
    to_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processed", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const leaveData = model("leaves", leaveSchema);
