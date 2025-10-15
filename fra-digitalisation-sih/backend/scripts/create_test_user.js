/* Create a test user for profile testing */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function createTestUser() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== Creating Test User ===\n');

    const Claimant = require('../model/claimant.js');
    
    // Check if test user already exists
    const existingUser = await Claimant.findOne({ aadhaarNumber: '123456789012' });
    if (existingUser) {
      console.log('Test user already exists:', existingUser.name);
      return;
    }

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const testUser = new Claimant({
      name: 'Dharam Bhai',
      aadhaarNumber: '123456789012',
      contactNumber: '9876543210',
      gender: 'Male',
      password: hashedPassword,
      email: 'dharam.bhai@example.com',
      tribeCategory: 'ST',
      village: 'Test Village',
      family: [],
      address: 'Test Address',
      gramPanchayat: 'Test GP',
      tehsil: 'Test Tehsil',
      district: 'Bhopal',
      state: 'Madhya Pradesh',
      dateOfBirth: '1985-03-15',
      occupation: 'Farmer'
    });

    await testUser.save();
    console.log('Test user created successfully:', testUser.name);
    console.log('Aadhaar:', testUser.aadhaarNumber);
    console.log('Email:', testUser.email);

    console.log('\n=== Test User Created ===');

  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createTestUser();
