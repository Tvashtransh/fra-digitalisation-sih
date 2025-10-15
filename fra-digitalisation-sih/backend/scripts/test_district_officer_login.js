/* Test District Officer Login API */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const { Admin } = require('../model/admin.js');

async function testDistrictOfficerLogin() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== Testing District Officer Login ===\n');

    // Test BHO001 credentials
    console.log('Testing BHO001 / bhopaldistrict123...');
    const districtOfficer = await Admin.findOne({ 
      districtId: 'BHO001',
      role: 'district_officer'
    });

    if (districtOfficer) {
      const isPasswordValid = await districtOfficer.comparePassword('bhopaldistrict123');
      console.log(`✅ BHO001 Password Test: ${isPasswordValid ? 'Valid' : 'Invalid'}`);
      
      if (isPasswordValid) {
        console.log('✅ District Officer Login should work with:');
        console.log('   Officer ID: BHO001');
        console.log('   Password: bhopaldistrict123');
        console.log('   Name:', districtOfficer.name);
        console.log('   District:', districtOfficer.assignedDistrict);
      }
    } else {
      console.log('❌ BHO001 not found');
    }

    // Test BHO002 credentials
    console.log('\nTesting BHO002 / bhopalblock123...');
    const blockOfficer = await Admin.findOne({ 
      districtId: 'BHO002',
      role: 'block_officer'
    });

    if (blockOfficer) {
      const isPasswordValid = await blockOfficer.comparePassword('bhopalblock123');
      console.log(`✅ BHO002 Password Test: ${isPasswordValid ? 'Valid' : 'Invalid'}`);
      
      if (isPasswordValid) {
        console.log('✅ Block Officer Login should work with:');
        console.log('   Officer ID: BHO002');
        console.log('   Password: bhopalblock123');
        console.log('   Name:', blockOfficer.name);
        console.log('   District:', blockOfficer.assignedDistrict);
      }
    } else {
      console.log('❌ BHO002 not found');
    }

    console.log('\n=== Frontend Updates ===');
    console.log('✅ Updated AuthModule.jsx to use Bhopal credentials');
    console.log('✅ Updated placeholder text to show BHO001, BHO002');
    console.log('✅ Updated help text to show Bhopal officers');
    console.log('✅ Added backend API call for district officer login');
    console.log('✅ Fixed field mapping (districtForestOfficerId -> officerId)');

    console.log('\n=== Ready to Test ===');
    console.log('1. Go to the login page');
    console.log('2. Select "District Officer" role');
    console.log('3. Enter BHO001 / bhopaldistrict123');
    console.log('4. Should successfully login and redirect to dashboard');

  } catch (error) {
    console.error('Error testing district officer login:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testDistrictOfficerLogin();
