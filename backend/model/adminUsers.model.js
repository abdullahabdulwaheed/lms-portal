import { model, Schema } from "mongoose";

const adminUsers = new Schema({
  name: {
    type: String,
    required: [true, "Enter the Name"],
  },
  email: {
    type: String,
    required: [true, "Enter the email"],
    unique: [true, "Email already exist"],
  },
  phone_number: {
    type: String,
    required: [true, "Enter the Phone number"],
  },
  position: {
    type: String,
    required: [true, "Enter the position"],
  },
  password: {
    type: String,
    required: [true, "Enter the password"],
  },
});

export const adminUsersData = model("adminUsersData", adminUsers);
