/* Check existing users in database */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Claimant = require('../model/claimant.js');

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== Users in Database ===\n');

    const users = await Claimant.find({}).select('name aadhaarNumber email contactNumber');
    
    console.log(`Total users found: ${users.length}\n`);
    
    if (users.length > 0) {
      users.forEach((user, index) => {
        console.log(`${index + 1}. Name: ${user.name}`);
        console.log(`   Aadhaar: ${user.aadhaarNumber}`);
        console.log(`   Email: ${user.email || 'Not set'}`);
        console.log(`   Contact: ${user.contactNumber || 'Not set'}`);
        console.log('');
      });
    } else {
      console.log('No users found in database');
    }

    console.log('=== Check Complete ===');

  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkUsers();
