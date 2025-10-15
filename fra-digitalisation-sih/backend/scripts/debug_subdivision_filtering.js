/* Debug Subdivision Filtering Logic */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Claim = require('../model/claim.js');

async function debugSubdivisionFiltering() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== DEBUGGING SUBDIVISION FILTERING ===\n');

    // Check all claims with their GP codes
    const allClaims = await Claim.find({}, {
      frapattaid: 1,
      gramPanchayat: 1,
      assignedGpCode: 1
    });

    console.log('All claims with GP codes:');
    allClaims.forEach(claim => {
      console.log(`${claim.frapattaid} - ${claim.gramPanchayat} (${claim.assignedGpCode})`);
    });

    // Test Phanda filter
    console.log('\n🔍 Testing Phanda Filter (GS-PHN-*):');
    const phandaFilter = { assignedGpCode: { $regex: '^GS-PHN-', $options: 'i' } };
    const phandaClaims = await Claim.find(phandaFilter);
    console.log(`Found ${phandaClaims.length} Phanda claims:`);
    phandaClaims.forEach(claim => {
      console.log(`  - ${claim.frapattaid} (${claim.assignedGpCode})`);
    });

    // Test Berasia filter
    console.log('\n🔍 Testing Berasia Filter (GS-BRS-*):');
    const berasiaFilter = { assignedGpCode: { $regex: '^GS-BRS-', $options: 'i' } };
    const berasiaClaims = await Claim.find(berasiaFilter);
    console.log(`Found ${berasiaClaims.length} Berasia claims:`);
    berasiaClaims.forEach(claim => {
      console.log(`  - ${claim.frapattaid} (${claim.assignedGpCode})`);
    });

    console.log('\n🎯 FILTERING SHOULD WORK:');
    console.log(`Phanda Officer should see: ${phandaClaims.length} claims`);
    console.log(`Berasia Officer should see: ${berasiaClaims.length} claims`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

debugSubdivisionFiltering();
