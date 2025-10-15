/* Test Bhopal District Officer Credentials */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const { Admin } = require('../model/admin.js');

async function testBhopalDistrictOfficers() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== Testing Bhopal District Officer Credentials ===\n');

    // Find Bhopal District Officer
    const districtOfficer = await Admin.findOne({ 
      districtId: 'BHO001',
      role: 'district_officer'
    });

    if (districtOfficer) {
      console.log('✅ Bhopal District Officer Found:');
      console.log(`   Name: ${districtOfficer.name}`);
      console.log(`   Email: ${districtOfficer.email}`);
      console.log(`   District ID: ${districtOfficer.districtId}`);
      console.log(`   Role: ${districtOfficer.role}`);
      console.log(`   District: ${districtOfficer.assignedDistrict}`);
      console.log(`   Contact: ${districtOfficer.contactNumber}`);
    } else {
      console.log('❌ Bhopal District Officer not found');
    }

    // Find Bhopal Block Officer
    const blockOfficer = await Admin.findOne({ 
      districtId: 'BHO002',
      role: 'block_officer'
    });

    if (blockOfficer) {
      console.log('\n✅ Bhopal Block Officer Found:');
      console.log(`   Name: ${blockOfficer.name}`);
      console.log(`   Email: ${blockOfficer.email}`);
      console.log(`   District ID: ${blockOfficer.districtId}`);
      console.log(`   Role: ${blockOfficer.role}`);
      console.log(`   District: ${blockOfficer.assignedDistrict}`);
      console.log(`   Contact: ${blockOfficer.contactNumber}`);
    } else {
      console.log('\n❌ Bhopal Block Officer not found');
    }

    console.log('\n=== Login Credentials ===');
    console.log('District Officer: BHO001 / bhopaldistrict123');
    console.log('Block Officer: BHO002 / bhopalblock123');
    console.log('Email: district@bhopal.gov.in / block@bhopal.gov.in');

    // Test password verification
    if (districtOfficer) {
      const isPasswordValid = await districtOfficer.comparePassword('bhopaldistrict123');
      console.log(`\n🔐 District Officer Password Test: ${isPasswordValid ? '✅ Valid' : '❌ Invalid'}`);
    }

    if (blockOfficer) {
      const isPasswordValid = await blockOfficer.comparePassword('bhopalblock123');
      console.log(`🔐 Block Officer Password Test: ${isPasswordValid ? '✅ Valid' : '❌ Invalid'}`);
    }

  } catch (error) {
    console.error('Error testing Bhopal district officers:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testBhopalDistrictOfficers();
