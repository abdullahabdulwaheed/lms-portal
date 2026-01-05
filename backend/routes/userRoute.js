import express from "express";
import {
  addUser,
  deleteUserByID,
  deleteUsers,
  editUser,
  getUser,
  getUserByID,
} from "../controller/userController.js";

const router = express.Router();

// Creating Employee

router.post("/add", addUser);

// Read Employee

router.get("/view", getUser);

// Read Employee

router.get("/view/:id", getUserByID);

// Update Employee

router.patch("/edit/:id", editUser);

// Delete Employee By ID

router.delete("/delete/:id", deleteUserByID);

// Delete Employee

router.delete("/delete", deleteUsers);

export default router;
