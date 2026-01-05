import bcrypt from "bcrypt";
import { usersData } from "../model/users.model.js";

// Create Admin

export const addUser = async (req, res) => {
  try {
    const findEmail = await usersData.findOne({ email: req.body.email });
    if (findEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }
    let hashedPass = "";
    if (req.body.password) {
      hashedPass = await bcrypt.hash(req.body.password, 12);
    }

    const newUser = new usersData({
      employee_no: req.body.employee_no || null,
      name: req.body.name || null,
      email: req.body.email || null,
      personal_email: req.body.personal_email || null,
      phone_no: req.body.phone_no || null,
      emerg_phone_no: req.body.emerg_phone_no || null,
      password: hashedPass || null,
      active: req.body.active === "active" ? 0 : 1 || null,
      dob: req.body.dob || null,
      dateOfJoining: req.body.dateOfJoining || null,
      dateOfReleving: req.body.dateOfReleving || null,
      blood_group: req.body.blood_group || null,
      emp_education: req.body.emp_education || null,
      aadhar_no: req.body.aadhar_no || null,
      pan_no: req.body.pan_no || null,
      emp_position: req.body.emp_position || null,
      report_to: req.body.report_to || null,
      joining_letter: req.body.joining_letter || null,
      experience_letter: req.body.experience_letter || null,
      no_of_leaves_month: req.body.no_of_leaves_month || null,
      user_type: req.body.user_type || null,
      employee_image: req.body.employee_image || null,
      address: req.body.address || null,
      bank_name: req.body.bank_name || null,
      account_no: req.body.account_no || null,
      ifsc_code: req.body.ifsc_code || null,
    });

    const user = await newUser.save();
    res.status(201).json({ Success: "User Created Successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Admin

export const getUser = async (req, res) => {
  try {
    const users = await usersData.find();
    if (!users) {
      return res.status(404).json({ message: "Users not found" });
    } else {
      res.status(200).json(users);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Admin By ID

export const getUserByID = async (req, res) => {
  try {
    const user = await usersData.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Edit Admin

export const editUser = async (req, res) => {
  try {
    let hashedPass = "";
    if (req.body.password) {
      hashedPass = await bcrypt.hash(req.body.password, 12);
    }

    const editUser = await usersData.findByIdAndUpdate(
      { _id: req.params.id },
      {
        employee_no: req.body.employee_no,
        name: req.body.name,
        email: req.body.email,
        personal_email: req.body.personal_email,
        phone_no: req.body.phone_no,
        emerg_phone_no: req.body.emerg_phone_no,
        password: hashedPass,
        active: req.body.active,
        dob: req.body.dob,
        dateOfJoining: req.body.dateOfJoining,
        dateOfReleving: req.body.dateOfReleving,
        blood_group: req.body.blood_group,
        emp_education: req.body.emp_education,
        aadhar_no: req.body.aadhar_no,
        pan_no: req.body.pan_no,
        emp_position: req.body.emp_position,
        report_to: req.body.report_to,
        joining_letter: req.body.joining_letter,
        experience_letter: req.body.experience_letter,
        no_of_leaves_month: req.body.no_of_leaves_month,
        user_type: req.body.user_type,
        employee_image: req.body.employee_image,
        address: req.body.address,
        bank_name: req.body.bank_name,
        account_no: req.body.account_no,
        ifsc_code: req.body.ifsc_code,
      },
      {
        new: true,
      }
    );

    res.status(200).json({ Success: "User Updated Successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Admin By ID

export const deleteUserByID = async (req, res) => {
  const userID = req.params.id;

  try {
    await usersData.deleteOne({ _id: adminID });
    res.json({ message: "Admin Deleted Successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Admin

export const deleteUsers = async (req, res) => {
  try {
    await usersData.deleteMany({});
    res.json({ message: "Users Deleted Successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
