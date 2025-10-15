/* Check existing claims in database */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Claim = require('../model/claim.js');

async function checkExistingClaims() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== Existing Claims in Database ===\n');

    const claims = await Claim.find({}).select('gpCode gramPanchayat tehsil district status createdAt');
    
    console.log(`Total claims found: ${claims.length}\n`);
    
    if (claims.length > 0) {
      claims.forEach((claim, index) => {
        console.log(`${index + 1}. Claim ID: ${claim._id}`);
        console.log(`   GP Code: ${claim.gpCode || 'Not set'}`);
        console.log(`   Gram Panchayat: ${claim.gramPanchayat || 'Not set'}`);
        console.log(`   Tehsil: ${claim.tehsil || 'Not set'}`);
        console.log(`   District: ${claim.district || 'Not set'}`);
        console.log(`   Status: ${claim.status || 'Not set'}`);
        console.log(`   Created: ${claim.createdAt || 'Not set'}`);
        console.log('');
      });
    } else {
      console.log('No claims found in database.');
    }

  } catch (error) {
    console.error('Error checking claims:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkExistingClaims();
