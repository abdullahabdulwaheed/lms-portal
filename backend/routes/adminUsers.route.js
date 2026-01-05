import express from "express";
import {
  addAdmin,
  deleteAdmin,
  deleteAdminByID,
  editAdmin,
  getAdmin,
  getAdminByID,
} from "../controller/adminUser.controller.js";

const router = express.Router();

// Creating Admin

router.post("/add", addAdmin);

// View Admin

router.get("/view", getAdmin);

// View Admin By ID

router.get("/view/:id", getAdminByID);

// Update Admin

router.patch("/edit/:id", editAdmin);

// Delete Admin By ID

router.delete("/delete/:id", deleteAdminByID);

// Delete Admin

router.delete("/delete", deleteAdmin);

export default router;
