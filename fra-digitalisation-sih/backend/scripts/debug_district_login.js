/* Debug District Officer Login */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const { Admin } = require('../model/admin.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function debugDistrictLogin() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== Debugging District Officer Login ===\n');

    // Check JWT_SECRET
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.log('JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);

    // Find the officer
    console.log('\nLooking for BHO001...');
    const officer = await Admin.findOne({ 
      districtId: 'BHO001',
      role: 'district_officer'
    });

    if (!officer) {
      console.log('❌ Officer not found');
      return;
    }

    console.log('✅ Officer found:');
    console.log('   ID:', officer._id);
    console.log('   Name:', officer.name);
    console.log('   District ID:', officer.districtId);
    console.log('   Role:', officer.role);
    console.log('   Assigned District:', officer.assignedDistrict);
    console.log('   Email:', officer.email);

    // Test password
    console.log('\nTesting password...');
    const isPasswordValid = await bcrypt.compare('bhopaldistrict123', officer.password);
    console.log('Password valid:', isPasswordValid);

    if (isPasswordValid) {
      // Test JWT creation
      console.log('\nTesting JWT creation...');
      try {
        const token = jwt.sign(
          { 
            districtId: officer.districtId,
            role: 'district_officer',
            district: officer.assignedDistrict
          },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );
        console.log('✅ JWT created successfully');
        console.log('Token length:', token.length);
      } catch (jwtError) {
        console.log('❌ JWT creation failed:', jwtError.message);
      }
    }

  } catch (error) {
    console.error('❌ Debug Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

debugDistrictLogin();
