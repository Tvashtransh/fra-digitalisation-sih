/* Check Claims Status for Block Officer */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Claim = require('../model/claim.js');

async function checkClaimsStatus() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== CHECKING ALL CLAIMS STATUS ===\n');

    const claims = await Claim.find({}, {
      frapattaid: 1,
      status: 1,
      gramPanchayat: 1,
      'applicantDetails.claimantName': 1
    });

    console.log(`Total Claims Found: ${claims.length}\n`);

    if (claims.length > 0) {
      console.log('📋 Claims by Status:\n');
      
      const statusGroups = {};
      claims.forEach(claim => {
        if (!statusGroups[claim.status]) {
          statusGroups[claim.status] = [];
        }
        statusGroups[claim.status].push(claim);
      });

      Object.keys(statusGroups).forEach(status => {
        console.log(`🔸 ${status}: ${statusGroups[status].length} claims`);
        statusGroups[status].slice(0, 3).forEach(claim => {
          console.log(`   - ${claim.frapattaid} - ${claim.applicantDetails?.claimantName || 'Unknown'} (${claim.gramPanchayat})`);
        });
        if (statusGroups[status].length > 3) {
          console.log(`   ... and ${statusGroups[status].length - 3} more`);
        }
        console.log('');
      });

      console.log('\n🎯 BLOCK OFFICER SHOULD SEE:');
      console.log('   - Claims with status: "ForwardedToDistrict"');
      console.log('   - Claims with status: "approved_by_subdivision"');
      console.log('   - Claims that need district-level review');
      
      const districtClaims = claims.filter(c => 
        c.status === 'ForwardedToDistrict' || 
        c.status === 'approved_by_subdivision' ||
        c.status === 'FinalApproved' ||
        c.status === 'FinalRejected'
      );
      
      console.log(`\n📊 District-Level Claims: ${districtClaims.length}`);
      if (districtClaims.length > 0) {
        districtClaims.forEach(claim => {
          console.log(`   - ${claim.frapattaid} - ${claim.status}`);
        });
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkClaimsStatus();
