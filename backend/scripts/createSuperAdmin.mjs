import bcrypt from "bcrypt";
import connectDB from "../lib/db.js";
import { adminUsersData } from "../model/adminModel.js";

const createSuperAdmin = async () => {
  try {
    await connectDB();

    const email = "abdulah01@gamil.com";

    const existing = await adminUsersData.findOne({ email });
    if (existing) {
      console.log("Super Admin already exists!");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("Abdullah35", 12);

    await adminUsersData.create({
      name: "Super Admin",
      email,
      phone_number: "0000000000",
      position: "Super Admin",
      password: hashedPassword,
      role: "superadmin",
    });

    console.log("✅ Super Admin created successfully!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createSuperAdmin();
