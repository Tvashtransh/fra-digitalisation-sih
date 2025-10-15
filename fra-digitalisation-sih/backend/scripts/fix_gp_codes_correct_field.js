/* Fix GP Codes Using Correct Field Name */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Claim = require('../model/claim.js');

async function fixGpCodesCorrectField() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== FIXING GP CODES WITH CORRECT FIELD NAME ===\n');

    // Get all claims first
    const allClaims = await Claim.find({});
    console.log(`Found ${allClaims.length} claims to update`);

    let phandaCount = 0;
    let berasiaCount = 0;

    for (const claim of allClaims) {
      const village = claim.gramPanchayat;
      let gpCode = null;

      // Assign based on village name patterns
      if (village && (
        village.includes('AMLA') || 
        village.includes('AMARPUR') || 
        village.includes('ACHARPURA')
      )) {
        // Phanda villages
        gpCode = `GS-PHN-${134000 + Math.floor(Math.random() * 500)}`;
        phandaCount++;
        console.log(`📍 ${claim.frapattaid} from ${village} → Phanda (${gpCode})`);
      } else if (village && (
        village.includes('AGARIYA') ||
        village.includes('BARKHEDA') ||
        village.includes('BARKHEDI') ||
        village.includes('MENDORI')
      )) {
        // Berasia villages  
        gpCode = `GS-BRS-${134000 + Math.floor(Math.random() * 500)}`;
        berasiaCount++;
        console.log(`📍 ${claim.frapattaid} from ${village} → Berasia (${gpCode})`);
      } else {
        // Default to Berasia for unknown villages
        gpCode = `GS-BRS-${134000 + Math.floor(Math.random() * 500)}`;
        berasiaCount++;
        console.log(`📍 ${claim.frapattaid} from ${village || 'UNKNOWN'} → Berasia (default) (${gpCode})`);
      }

      // Update the claim with correct field name 'gpCode'
      await Claim.updateOne(
        { _id: claim._id },
        { $set: { gpCode: gpCode } }
      );
    }

    console.log('\n✅ GP CODES ASSIGNED TO CORRECT FIELD:');
    console.log(`🏛️ Phanda Claims: ${phandaCount}`);
    console.log(`🏛️ Berasia Claims: ${berasiaCount}`);

    // Verify the update worked
    console.log('\n🔍 VERIFICATION:');
    const phandaClaims = await Claim.find({ gpCode: { $regex: '^GS-PHN-', $options: 'i' } });
    const berasiaClaims = await Claim.find({ gpCode: { $regex: '^GS-BRS-', $options: 'i' } });
    
    console.log(`✅ Phanda claims in DB: ${phandaClaims.length}`);
    console.log(`✅ Berasia claims in DB: ${berasiaClaims.length}`);

    console.log('\n🎯 SUBDIVISION OFFICERS READY:');
    console.log(`✅ Phanda Officer (PHN001): ${phandaClaims.length} claims`);
    console.log(`✅ Berasia Officer (BRS001): ${berasiaClaims.length} claims`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

fixGpCodesCorrectField();
