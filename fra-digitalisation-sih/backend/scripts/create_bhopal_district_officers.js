/* Create Bhopal District Officers */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const { Admin } = require('../model/admin.js');
const bcryptjs = require('bcryptjs');

async function createBhopalDistrictOfficers() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== Creating Bhopal District Officers ===\n');

    // Clean up existing district officers
    await Admin.deleteMany({ 
      $or: [
        { districtId: { $exists: true } },
        { role: 'district_officer' },
        { role: 'block_officer' }
      ]
    });
    console.log('Cleaned up existing district/block officers');

    // Add districtId field to existing admins if it doesn't exist
    await Admin.updateMany(
      { districtId: { $exists: false } },
      { $set: { districtId: null } }
    );

    // Create Bhopal District Officer
    const bhopalDistrictOfficer = new Admin({
      name: 'Bhopal District Officer',
      email: 'district@bhopal.gov.in',
      password: 'bhopaldistrict123', // Plain text - will be auto-hashed
      contactNumber: '9876543210',
      role: 'district_officer',
      districtId: 'BHO001',
      assignedDistrict: 'Bhopal',
      assignedSubdivision: 'Bhopal',
      assignedGramPanchayat: 'Bhopal',
      assignedGpCode: 'BHO-DISTRICT-001'
    });
    await bhopalDistrictOfficer.save();
    console.log('✅ Created Bhopal District Officer');

    // Create Bhopal Block Officer
    const bhopalBlockOfficer = new Admin({
      name: 'Bhopal Block Officer',
      email: 'block@bhopal.gov.in',
      password: 'bhopalblock123', // Plain text - will be auto-hashed
      contactNumber: '9876543211',
      role: 'block_officer',
      districtId: 'BHO002',
      assignedDistrict: 'Bhopal',
      assignedSubdivision: 'Bhopal',
      assignedGramPanchayat: 'Bhopal',
      assignedGpCode: 'BHO-BLOCK-001'
    });
    await bhopalBlockOfficer.save();
    console.log('✅ Created Bhopal Block Officer');

    console.log('\n=== Bhopal District Officers Created ===');
    console.log('District Officer: BHO001 / bhopaldistrict123');
    console.log('Block Officer: BHO002 / bhopalblock123');
    console.log('Email: district@bhopal.gov.in / block@bhopal.gov.in');

  } catch (error) {
    console.error('Error creating Bhopal district officers:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createBhopalDistrictOfficers();
