const mongoose = require('mongoose');
const ClaimantSchema = new mongoose.Schema({
  // Personal info
  name: { type: String, required: true },
  spouseName: String,
  fatherOrMotherName: String,
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  aadhaarNumber: { type: String, unique: true, required: true, trim: true },
  contactNumber: String,

  // Address info
  address: String,
  village: String,
  gramPanchayat: String,
  tehsil: String,
  district: String,
  state: String,

  // Tribe status
  tribeCategory: { type: String, enum: ["ST", "OTFD"], required: true },

  // Family members
  family: [{
name: String,
  age: Number,
  relation: String,
  }],

  // Authentication
  password: { type: String, required: true },

  // FRA ID - generated when user applies for first claim
  fraId: { type: String, unique: true, sparse: true },

  // Additional profile fields
  email: String,
  dateOfBirth: String,
  occupation: String,

  createdAt: { type: Date, default: Date.now },
});

// Ensure unique index on Aadhaar number at the database level
ClaimantSchema.index({ aadhaarNumber: 1 }, { unique: true });

// Normalize Aadhaar: keep only digits
ClaimantSchema.pre('save', function(next) {
  if (this.isModified('aadhaarNumber') && typeof this.aadhaarNumber === 'string') {
    this.aadhaarNumber = this.aadhaarNumber.replace(/\D+/g, '');
  }
  next();
});

// Basic Aadhaar format validation (12 digits)
ClaimantSchema.path('aadhaarNumber').validate(function(value) {
  return /^\d{12}$/.test(value);
}, 'Aadhaar must be 12 digits');






module.exports  = mongoose.model("Claimant", ClaimantSchema);





