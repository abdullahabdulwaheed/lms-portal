import { model, Schema } from "mongoose";

const holidaySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      unique: true,
    },
    type: {
      type: String, // Public, Restricted, Company
      default: 'Public'
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export const holidayData = model("holidays", holidaySchema);
