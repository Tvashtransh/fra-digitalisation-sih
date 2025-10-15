/* Fix All Claim GP Codes to Match Gram Sabha Officers */
require('dotenv').config();
const mongoose = require('mongoose');
const Claim = require('../model/claim.js');
const Claimant = require('../model/claimant.js');

async function fixAllClaimGpCodes() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== FIXING ALL CLAIM GP CODES ===\n');

    // Load GP data
    const fsp = require('fs');
    const pth = require('path');
    const pick = (file) => JSON.parse(fsp.readFileSync(pth.join(__dirname, '..', 'data', file), 'utf8'));
    const phandaGps = pick('phanda-gp.json');
    const berasiaGps = pick('berasia-gp.json');

    // Get all claims
    const allClaims = await Claim.find({});
    console.log(`Found ${allClaims.length} claims to check`);

    let fixedCount = 0;
    let alreadyCorrectCount = 0;

    for (const claim of allClaims) {
      const village = claim.gramPanchayat;
      const tehsil = claim.tehsil;
      
      if (!village || !tehsil) {
        console.log(`⚠️ Skipping ${claim.frapattaid}: Missing village or tehsil`);
        continue;
      }

      // Find the correct GP code
      let correctGpCode = null;
      if (tehsil.toLowerCase() === 'phanda') {
        const hit = phandaGps.find(x => (x.gpName || '').toLowerCase() === village.toLowerCase());
        if (hit?.gpCode) {
          correctGpCode = `GS-PHN-${hit.gpCode}`;
        }
      } else if (tehsil.toLowerCase() === 'berasia') {
        const hit = berasiaGps.find(x => (x.gpName || '').toLowerCase() === village.toLowerCase());
        if (hit?.gpCode) {
          correctGpCode = `GS-BRS-${hit.gpCode}`;
        }
      }

      if (correctGpCode) {
        if (claim.gpCode === correctGpCode) {
          alreadyCorrectCount++;
          console.log(`✅ ${claim.frapattaid} (${village}): Already correct (${claim.gpCode})`);
        } else {
          await Claim.updateOne(
            { _id: claim._id },
            { $set: { gpCode: correctGpCode } }
          );
          fixedCount++;
          console.log(`🔧 ${claim.frapattaid} (${village}): Fixed ${claim.gpCode} → ${correctGpCode}`);
        }
      } else {
        console.log(`❌ ${claim.frapattaid} (${village}): No GP code found in data files`);
      }
    }

    console.log('\n✅ GP CODE FIX SUMMARY:');
    console.log(`🔧 Fixed: ${fixedCount} claims`);
    console.log(`✅ Already correct: ${alreadyCorrectCount} claims`);
    console.log(`📊 Total processed: ${allClaims.length} claims`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixAllClaimGpCodes();
