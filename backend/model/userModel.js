import { model, Schema } from "mongoose";

const users = new Schema({
  employee_no: {
    type: String,
    required: [true, "Enter the Employee Number"],
  },
  name: {
    type: String,
    required: [true, "Enter the Name"],
  },
  dob: {
    type: String,
    required: false,
    default: null,
  },
  dateOfJoining: {
    type: String,
    required: false,
    default: null,
  },
  dateOfReleving: {
    type: String,
    required: false,
    default: null,
  },
  blood_group: {
    type: String,
    required: false,
    default: null,
  },
  emp_education: {
    type: String,
    required: false,
    default: null,
  },
  aadhar_no: {
    type: String,
    required: false,
    default: null,
  },
  pan_no: {
    type: String,
    required: false,
    default: null,
  },
  email: {
    type: String,
    required: [true, "Enter the Email"],
    unique: true,
  },
  personal_email: {
    type: String,
    required: [true, "Enter the personal email"],
    unique: true,
  },
  phone_no: {
    type: Number,
    required: [true, "Enter the Phone Number"],
    unique: true,
  },
  emerg_phone_no: {
    type: Number,
    required: [true, "Enter the Emergency phone Number"],
    unique: true,
    default: null,
  },
  password: {
    type: String,
    required: [true, "Enter the Password"],
  },
  emp_position: {
    type: String,
    required: false,
    default: null,
  },
  report_to: {
    type: Number,
  },
  joining_letter: {
    type: String,
    required: false,
    default: null,
  },
  experience_letter: {
    type: String,
    required: false,
    default: null,
  },
  no_of_leaves_month: {
    type: Number,
    required: false,
    default: null,
  },
  user_type: {
    type: String,
    required: false,
    default: null,
  },
  active: {
    type: String,
    required: [true, "Enter the Status"],
    default: null,
  },
  employee_image: {
    type: String,
    required: false,
    default: null,
  },
  address: {
    type: String,
    required: false,
    default: null,
  },
  bank_name: {
    type: String,
    required: false,
    default: null,
  },
  account_no: {
    type: String,
    required: false,
    default: null,
  },
  ifsc_code: {
    type: String,
    required: false,
    default: null,
  },
});

export const usersData = model("usersData", users);
