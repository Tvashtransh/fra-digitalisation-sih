// controllers/adminController.js
const {Admin} = require("../model/admin");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const JWT_SECRET = process.env.JWT_SECRET || "fra_secret"; // keep in .env

// Register a new admin
module.exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, contactNumber, role, assignedDistrict, assignedVillage } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: "Admin already exists" });

    const newAdmin = new Admin({
      name,
      email,
      password,
      contactNumber,
      role,
      assignedDistrict,
      assignedVillage,
    });

    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login admin
module.exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcryptjs.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false }); // secure:true in prod
    res.json({
      message: `${admin.role} logged in successfully`,
      role: admin.role,
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin Logout
module.exports.logoutAdmin = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'lax'
    });
    
    res.status(200).json({ 
      message: "Admin logged out successfully", 
      success: true 
    });
  } catch (error) {
    console.error('Admin Logout error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};