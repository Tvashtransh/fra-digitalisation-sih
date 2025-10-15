/* Create Dharam Bhai user with known credentials */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function createDharamUser() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== Creating Dharam Bhai User ===\n');

    const Claimant = require('../model/claimant.js');
    
    // Delete existing user if exists
    await Claimant.deleteOne({ aadhaarNumber: '789456130145' });
    console.log('Deleted existing user if any');

    // Create Dharam Bhai user
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const dharamUser = new Claimant({
      name: 'Dharam Bhai',
      aadhaarNumber: '789456130145',
      contactNumber: '8462519573',
      gender: 'Male',
      password: hashedPassword,
      email: 'dharam.bhai@example.com',
      tribeCategory: 'ST',
      village: 'Borkheda',
      family: [],
      address: 'Incubation center, IET DAVV, Indore',
      gramPanchayat: 'BARKHEDA YAKUB',
      tehsil: 'Berasia',
      district: 'Bhopal',
      state: 'Madhya Pradesh',
      dateOfBirth: '1985-03-15',
      occupation: 'Farmer'
    });

    await dharamUser.save();
    console.log('Dharam Bhai user created successfully!');
    console.log('Name:', dharamUser.name);
    console.log('Aadhaar:', dharamUser.aadhaarNumber);
    console.log('Email:', dharamUser.email);
    console.log('Password: password123');

    console.log('\n=== User Created Successfully ===');

  } catch (error) {
    console.error('Error creating Dharam Bhai user:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createDharamUser();
