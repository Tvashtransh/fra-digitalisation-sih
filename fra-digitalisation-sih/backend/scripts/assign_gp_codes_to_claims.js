/* Assign GP Codes to Existing Claims */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Claim = require('../model/claim.js');

async function assignGpCodesToClaims() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== ASSIGNING GP CODES TO EXISTING CLAIMS ===\n');

    // Define village to subdivision mapping based on the existing data
    const phandaVillages = [
      'AMLA',
      'AMARPUR', 
      'ACHARPURA'
    ];

    const berasiaVillages = [
      'AGARIYA',
      'BARKHEDA YAKUB',
      'BARKHEDI ABDULLA', 
      'MENDORI'
    ];

    // Update Phanda villages
    for (const village of phandaVillages) {
      const result = await Claim.updateMany(
        { 
          gramPanchayat: village,
          $or: [
            { assignedGpCode: { $exists: false } },
            { assignedGpCode: null },
            { assignedGpCode: '' }
          ]
        },
        { 
          $set: { 
            assignedGpCode: `GS-PHN-${Math.floor(Math.random() * 900) + 100}` // Random GP code for Phanda
          }
        }
      );
      if (result.modifiedCount > 0) {
        console.log(`✅ Updated ${result.modifiedCount} claims from ${village} with Phanda GP codes`);
      }
    }

    // Update Berasia villages
    for (const village of berasiaVillages) {
      const result = await Claim.updateMany(
        { 
          gramPanchayat: village,
          $or: [
            { assignedGpCode: { $exists: false } },
            { assignedGpCode: null },
            { assignedGpCode: '' }
          ]
        },
        { 
          $set: { 
            assignedGpCode: `GS-BRS-${Math.floor(Math.random() * 900) + 100}` // Random GP code for Berasia
          }
        }
      );
      if (result.modifiedCount > 0) {
        console.log(`✅ Updated ${result.modifiedCount} claims from ${village} with Berasia GP codes`);
      }
    }

    // Check results
    console.log('\n📊 UPDATED CLAIMS:');
    const updatedClaims = await Claim.find({}, {
      frapattaid: 1,
      gramPanchayat: 1,
      assignedGpCode: 1
    });

    const phandaClaims = updatedClaims.filter(c => c.assignedGpCode && c.assignedGpCode.startsWith('GS-PHN-'));
    const berasiaClaims = updatedClaims.filter(c => c.assignedGpCode && c.assignedGpCode.startsWith('GS-BRS-'));

    console.log(`🏛️ Phanda Claims: ${phandaClaims.length}`);
    phandaClaims.forEach(c => console.log(`   - ${c.frapattaid} from ${c.gramPanchayat} (${c.assignedGpCode})`));

    console.log(`🏛️ Berasia Claims: ${berasiaClaims.length}`);
    berasiaClaims.forEach(c => console.log(`   - ${c.frapattaid} from ${c.gramPanchayat} (${c.assignedGpCode})`));

    console.log('\n🎯 SUBDIVISION FILTERING NOW READY:');
    console.log(`✅ Phanda Officer (PHN001) will see: ${phandaClaims.length} claims`);
    console.log(`✅ Berasia Officer (BRS001) will see: ${berasiaClaims.length} claims`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

assignGpCodesToClaims();
