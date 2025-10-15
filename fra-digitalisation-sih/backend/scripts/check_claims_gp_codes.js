/* Check Claims GP Codes for Subdivision Filtering */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Claim = require('../model/claim.js');

async function checkClaimsGpCodes() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== CHECKING CLAIMS GP CODES ===\n');

    const claims = await Claim.find({}, {
      frapattaid: 1,
      gramPanchayat: 1,
      assignedGpCode: 1
    });

    console.log(`Total Claims: ${claims.length}\n`);

    if (claims.length > 0) {
      console.log('Claims by GP Code:');
      claims.forEach(claim => {
        console.log(`${claim.frapattaid} - ${claim.gramPanchayat} (${claim.assignedGpCode || 'NO GP CODE'})`);
      });

      // Count by subdivision
      const phandaClaims = claims.filter(c => c.assignedGpCode && c.assignedGpCode.startsWith('GS-PHN-'));
      const berasiaClaims = claims.filter(c => c.assignedGpCode && c.assignedGpCode.startsWith('GS-BRS-'));
      const otherClaims = claims.filter(c => !c.assignedGpCode || (!c.assignedGpCode.startsWith('GS-PHN-') && !c.assignedGpCode.startsWith('GS-BRS-')));

      console.log('\n📊 SUBDIVISION BREAKDOWN:');
      console.log(`🏛️ Phanda (GS-PHN-*): ${phandaClaims.length} claims`);
      if (phandaClaims.length > 0) {
        phandaClaims.forEach(c => console.log(`   - ${c.frapattaid} (${c.assignedGpCode})`));
      }
      
      console.log(`🏛️ Berasia (GS-BRS-*): ${berasiaClaims.length} claims`);
      if (berasiaClaims.length > 0) {
        berasiaClaims.forEach(c => console.log(`   - ${c.frapattaid} (${c.assignedGpCode})`));
      }
      
      console.log(`❓ Other/Unknown: ${otherClaims.length} claims`);
      if (otherClaims.length > 0) {
        otherClaims.forEach(c => console.log(`   - ${c.frapattaid} (${c.assignedGpCode || 'NO GP CODE'})`));
      }

      console.log('\n🎯 FILTERING RESULTS:');
      console.log(`Phanda Officer (PHN001) will see: ${phandaClaims.length} claims`);
      console.log(`Berasia Officer (BRS001) will see: ${berasiaClaims.length} claims`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkClaimsGpCodes();
