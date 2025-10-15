/* Simple District Officer Login Test */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const { Admin } = require('../model/admin.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function testDistrictLogin() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== Testing District Officer Login Logic ===\n');

    const { officerId, password } = { officerId: 'BHO001', password: 'bhopaldistrict123' };

    console.log('Input:', { officerId, password });

    if (!officerId || !password) {
      console.log('❌ Missing officerId or password');
      return;
    }

    // Find district officer
    const officer = await Admin.findOne({ 
      districtId: officerId,
      role: 'district_officer'
    });

    console.log('Officer found:', !!officer);
    if (officer) {
      console.log('Officer details:', {
        id: officer._id,
        districtId: officer.districtId,
        name: officer.name,
        role: officer.role,
        assignedDistrict: officer.assignedDistrict
      });
    }

    if (!officer) {
      console.log('❌ Invalid credentials - officer not found');
      return;
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, officer.password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('❌ Invalid credentials - password mismatch');
      return;
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        districtId: officer.districtId,
        role: 'district_officer',
        district: officer.assignedDistrict
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ Login successful!');
    console.log('Token created:', !!token);
    console.log('Response would be:', {
      success: true,
      message: 'Login successful',
      token: token.substring(0, 20) + '...',
      officer: {
        id: officer._id,
        districtId: officer.districtId,
        name: officer.name,
        district: officer.assignedDistrict,
        role: officer.role
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testDistrictLogin();
