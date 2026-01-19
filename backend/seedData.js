import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { usersData } from "./model/userModel.js";
import { teamsData } from "./model/teamsModel.js";
import { eventData } from "./model/eventModel.js";
import { holidayData } from "./model/holidayModel.js";
import { adminUsersData } from "./model/adminModel.js";

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB for Seeding");

        // Clear existing data
        await usersData.deleteMany({});
        await teamsData.deleteMany({});
        await eventData.deleteMany({});
        await holidayData.deleteMany({});

        // Note: check if we should clear Admins. Maybe preserve if one exists, but for demo let's ensure we have distinct accounts.
        // For safety, let's just add if not exists, or overwrite. User wants "Add data", implies populating.
        // I will clear admins to ensure clean state for "superadmin" vs "admin" login testing.
        await adminUsersData.deleteMany({});

        console.log("Cleared existing data");

        // 1. Create Admins
        const passwordHash = await bcrypt.hash("password123", 10);

        const superAdmin = await adminUsersData.create({
            name: "Global Commander",
            email: "superadmin@corp.com",
            phone_number: "9998887770",
            position: "System Overseer",
            password: passwordHash,
            role: "superadmin"
        });

        const admin = await adminUsersData.create({
            name: "Regional Director",
            email: "admin@corp.com",
            phone_number: "9998887771",
            position: "Operations Lead",
            password: passwordHash,
            role: "admin"
        });

        const requestedAdmin = await adminUsersData.create({
            name: "Test Administrator",
            email: "admin3@lms.com",
            phone_number: "9998887772",
            position: "System Test Lead",
            password: passwordHash,
            role: "admin"
        });

        console.log("Admins created");

        // 2. Create Employees
        const employees = await usersData.insertMany([
            {
                employee_no: "EMP001",
                name: "Sarah Connors",
                email: "sarah@corp.com",
                personal_email: "sarah.p@gmail.com",
                phone_no: 9876543210,
                emerg_phone_no: 9876543200,
                password: passwordHash,
                active: "active",
                emp_position: "Senior Analyst",
                department: "Intelligence",
                dateOfJoining: "2024-01-15",
                user_type: "Permanent"
            },
            {
                employee_no: "EMP002",
                name: "John Wick",
                email: "john@corp.com",
                personal_email: "john.wick@gmail.com",
                phone_no: 9876543211,
                emerg_phone_no: 9876543201,
                password: passwordHash,
                active: "active",
                emp_position: "Security Consultant",
                department: "Operations",
                dateOfJoining: "2023-11-20",
                user_type: "Contract"
            },
            {
                employee_no: "EMP003",
                name: "Ellen Ripley",
                email: "ripley@corp.com",
                personal_email: "ripley@space.com",
                phone_no: 9876543212,
                emerg_phone_no: 9876543202,
                password: passwordHash,
                active: "active",
                emp_position: "Logistics Manager",
                department: "Logistics",
                dateOfJoining: "2022-05-10",
                user_type: "Permanent"
            },
            {
                employee_no: "EMP004",
                name: "Tony Stark",
                email: "tony@corp.com",
                personal_email: "ironman@avengers.com",
                phone_no: 9876543213,
                emerg_phone_no: 9876543203,
                password: passwordHash,
                active: "active",
                emp_position: "Tech Lead",
                department: "R&D",
                dateOfJoining: "2021-03-01",
                user_type: "Permanent"
            },
            {
                employee_no: "EMP005",
                name: "Bruce Wayne",
                email: "bruce@corp.com",
                personal_email: "batman@gotham.com",
                phone_no: 9876543214,
                emerg_phone_no: 9876543204,
                password: passwordHash,
                active: "active",
                emp_position: "Financial Analyst",
                department: "Finance",
                dateOfJoining: "2023-01-10",
                user_type: "Contract"
            }
        ]);

        console.log("Employees created");

        // 3. Create Teams
        // Note: teamsModel expects user_id as array of ObjectIds (after my fix).
        await teamsData.create([
            {
                team_name: "Alpha Squad - R&D",
                user_id: [employees[3]._id, employees[0]._id] // Tony, Sarah
            },
            {
                team_name: "Bravo Team - Security",
                user_id: [employees[1]._id] // John
            },
            {
                team_name: "Logistics Core",
                user_id: [employees[2]._id, employees[4]._id] // Ripley, Bruce
            }
        ]);

        console.log("Teams created");

        // 4. Create Holidays
        const currentYear = new Date().getFullYear();
        await holidayData.insertMany([
            { name: "New Year's Day", date: `${currentYear}-01-01`, type: "Public", description: "Global holiday" },
            { name: "Corporate Founding Day", date: `${currentYear}-03-15`, type: "Company", description: "Mandatory shutdown" },
            { name: "Labor Day", date: `${currentYear}-05-01`, type: "Public", description: "International workers day" },
            { name: "Innovation Summit", date: `${currentYear}-09-10`, type: "Restricted", description: "Optional holiday for R&D" },
            { name: "Christmas Day", date: `${currentYear}-12-25`, type: "Public" }
        ]);

        console.log("Holidays created");

        // 5. Create Events
        await eventData.insertMany([
            {
                title: "Q1 Strategy Meeting",
                description: "Review of first quarter performance and Q2 goals.",
                date: `${currentYear}-04-01`,
                time: "10:00 AM",
                location: "Conference Room A",
                type: "Meeting",
                createdBy: superAdmin._id
            },
            {
                title: "Cybersecurity Workshop",
                description: "Mandatory training on new security protocols.",
                date: `${currentYear}-04-10`,
                time: "02:00 PM",
                location: "Virtual (Zoom)",
                type: "Training",
                createdBy: admin._id
            },
            {
                title: "Annual Gala",
                description: "Corporate networking event.",
                date: `${currentYear}-06-20`,
                time: "07:00 PM",
                location: "Grand Hall",
                type: "Social",
                createdBy: superAdmin._id
            }
        ]);

        console.log("Events created");

        console.log("SEEDING COMPLETE");
        process.exit();

    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedData();
