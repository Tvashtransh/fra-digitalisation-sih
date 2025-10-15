/* Recreate Block Officer for Bhopal */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const { Admin } = require('../model/admin.js');

async function recreateBlockOfficer() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== Recreating Bhopal Block Officer ===\n');

    // Remove any existing BHO002
    await Admin.deleteOne({ districtId: 'BHO002' });

    // Create new Bhopal Block Officer
    const blockOfficer = new Admin({
      name: 'Bhopal Block Officer',
      email: 'block@bhopal.gov.in',
      password: 'bhopalblock123', // Will be auto-hashed
      contactNumber: '9876543211',
      role: 'block_officer',
      districtId: 'BHO002',
      assignedDistrict: 'Bhopal',
      assignedSubdivision: 'Bhopal',
      assignedGramPanchayat: 'Bhopal',
      assignedGpCode: 'BHO-BLOCK-001'
    });
    
    await blockOfficer.save();
    console.log('✅ Created Bhopal Block Officer');

    console.log('\n=== Block Officer Credentials ===');
    console.log('Officer ID: BHO002');
    console.log('Password: bhopalblock123');
    console.log('Email: block@bhopal.gov.in');
    console.log('Role: block_officer');
    console.log('District: Bhopal');

    console.log('\n🎯 Block Officer dashboard should now work!');

  } catch (error) {
    console.error('Error recreating block officer:', error);
  } finally {
    await mongoose.disconnect();
  }
}

recreateBlockOfficer();
