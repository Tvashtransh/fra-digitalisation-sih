/* Fix existing claims to use correct GP code format */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Claim = require('../model/claim.js');

async function fixExistingClaimsGpCode() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== Fixing Existing Claims GP Codes ===\n');

    // Get all claims with numeric GP codes
    const claims = await Claim.find({ 
      gpCode: { $regex: /^\d+$/ } // Only numeric GP codes
    });

    console.log(`Found ${claims.length} claims with numeric GP codes`);

    for (const claim of claims) {
      console.log(`\nProcessing claim: ${claim.frapattaid}`);
      console.log(`Current GP Code: ${claim.gpCode}`);
      console.log(`Gram Panchayat: ${claim.gramPanchayat}`);
      console.log(`Tehsil: ${claim.tehsil}`);

      let newGpCode = claim.gpCode;

      // Convert based on tehsil
      if (claim.tehsil && claim.tehsil.toLowerCase() === 'phanda') {
        newGpCode = `GS-PHN-${claim.gpCode}`;
      } else if (claim.tehsil && claim.tehsil.toLowerCase() === 'berasia') {
        newGpCode = `GS-BRS-${claim.gpCode}`;
      }

      if (newGpCode !== claim.gpCode) {
        claim.gpCode = newGpCode;
        await claim.save();
        console.log(`✅ Updated GP Code: ${newGpCode}`);
      } else {
        console.log(`⚠️ No change needed for GP Code: ${claim.gpCode}`);
      }
    }

    console.log('\n=== Fix Complete ===');

    // Verify the fix
    console.log('\n=== Verifying Fix ===\n');
    const updatedClaims = await Claim.find({}).select('frapattaid gramPanchayat tehsil gpCode');
    console.log('Updated claims:');
    updatedClaims.forEach(claim => {
      console.log(`- FRA ID: ${claim.frapattaid}, GP: ${claim.gramPanchayat}, GP Code: ${claim.gpCode}`);
    });

  } catch (error) {
    console.error('Error fixing claims GP codes:', error);
  } finally {
    await mongoose.disconnect();
  }
}

fixExistingClaimsGpCode();
