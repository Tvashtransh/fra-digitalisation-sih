const mongoose = require('mongoose');

const GramSabhaOfficerSchema = new mongoose.Schema({
  gramSabhaId: { type: String, unique: true, required: true, trim: true },
  passwordHash: { type: String, required: true },
  gpCode: { type: String, index: true, required: true },
  gpName: { type: String, required: true },
  subdivision: { type: String, required: true }, // e.g., Berasia
  district: { type: String, required: true }, // e.g., Bhopal
  villages: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

GramSabhaOfficerSchema.index({ gpCode: 1 });

module.exports = mongoose.model('GramSabhaOfficer', GramSabhaOfficerSchema);


