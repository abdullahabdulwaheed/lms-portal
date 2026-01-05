import { model, Schema } from "mongoose";

const holidaySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export const holidayData = model("holidays", holidaySchema);
