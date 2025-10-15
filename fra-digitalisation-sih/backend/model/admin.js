const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

// Admin / Official schema
const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  contactNumber: String,

  // Role-based access
  role: {
    type: String,
    enum: [
      "GramSabha",       // verifies & passes resolutions
      "SDLCOfficer",     // reviews claims at subdivision level
      "DLCOfficer",      // final approval authority
      "district_officer", // district level officer
      "block_officer",   // block level officer
      "SuperAdmin"       // full system access
    ],
    required: true,
  },

  // Officer ID for district/block officers
  districtId: String,
  
  // Officer ID for subdivision officers
  subdivisionId: String,

  // Location-based access control
  assignedDistrict: String,
  assignedSubdivision: String, // e.g., Phanda, Berasia
  assignedGramPanchayat: String, // e.g., Mendori
  assignedGpCode: String, // Gram Panchayat code
  assignedVillage: String,
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date,
});

// Hash password before saving
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcryptjs.hash(this.password, 10);
  next();
});

// Password check
AdminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcryptjs.compare(candidatePassword, this.password);
};

module.exports.Admin = mongoose.model("Admin", AdminSchema);

