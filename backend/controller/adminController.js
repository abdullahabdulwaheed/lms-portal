import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { adminUsersData } from "../model/adminModel.js";


// Admin Login

export const adminLogin = async (req, res) => {
  try {
    const email = req.body.email?.trim();
    const password = req.body.password;


    // Check email
    const admin = await adminUsersData.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: admin._id, role: admin.role || "admin" },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        position: admin.position,
        role: admin.role || "admin",
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


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
      role: req.body.role || "admin",
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
        role: req.body.role || "admin",
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
