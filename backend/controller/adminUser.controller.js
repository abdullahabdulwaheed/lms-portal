import bcrypt from "bcrypt";
import { adminUsersData } from "../model/adminUsers.model.js";

// Create Admin

export const addAdmin = async (req, res) => {
  try {
    const findEmail = await adminUsersData.findOne({
      email: req.body.email,
    });
    if (findEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPass = await bcrypt.hash(req.body.password, 12);

    const newAdmin = new adminUsersData({
      name: req.body.name,
      email: req.body.email,
      phone_number: req.body.phone_number,
      position: req.body.position,
      password: hashedPass,
    });

    const adminUser = await newAdmin.save();
    res.status(201).json({ Success: "Admin Created Successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Admin

export const getAdmin = async (req, res) => {
  try {
    const adminUsers = await adminUsersData.find();
    if (!adminUsers) {
      return res.status(404).json({ message: "Admin user not found" });
    } else {
      res.status(200).json(adminUsers);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Admin By ID

export const getAdminByID = async (req, res) => {
  try {
    const adminUser = await adminUsersData.findById(req.params.id);
    if (!adminUser) {
      return res.status(404).json({ message: "Admin not found" });
    } else {
      res.status(200).json(adminUser);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Edit Admin

export const editAdmin = async (req, res) => {
  try {
    const hashedPass = await bcrypt.hash(req.body.password, 12);

    const editAdmin = await adminUsersData.findByIdAndUpdate(
      { _id: req.params.id },
      {
        name: req.body.name,
        email: req.body.email,
        phone_number: req.body.phone_number,
        position: req.body.position,
        password: hashedPass,
      },
      {
        new: true,
      }
    );

    res.status(200).json({ Success: "Admin Updated Successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Admin By ID

export const deleteAdminByID = async (req, res) => {
  const adminID = req.params.id;

  try {
    await adminUsersData.deleteOne({ _id: adminID });
    res.json({ message: "Admin Deleted Successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Admin

export const deleteAdmin = async (req, res) => {
  try {
    await adminUsersData.deleteMany({});
    res.json({ message: "Admin User Deleted Successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
