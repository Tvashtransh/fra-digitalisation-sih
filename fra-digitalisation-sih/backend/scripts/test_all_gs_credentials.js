/* Test All Gram Sabha Credentials */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const GramSabhaOfficer = require('../model/gramsabhaofficer');
const bcrypt = require('bcryptjs');

async function testAllGSCredentials() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Get all Gram Sabha officers from database
    const allOfficers = await GramSabhaOfficer.find({}).sort({ subdivision: 1, gpName: 1 });
    
    console.log(`\n=== Testing All Gram Sabha Credentials ===`);
    console.log(`Total officers in database: ${allOfficers.length}\n`);

    let successCount = 0;
    let failCount = 0;
    const results = [];

    for (const officer of allOfficers) {
      // Generate the expected password based on the pattern
      const expectedPassword = officer.subdivision === 'Phanda' 
        ? `phn-${officer.gpCode}-2025`
        : `brs-${officer.gpCode}-2025`;

      // Test password verification
      const isValid = await bcrypt.compare(expectedPassword, officer.passwordHash);
      
      const result = {
        gramSabhaId: officer.gramSabhaId,
        gpName: officer.gpName,
        subdivision: officer.subdivision,
        expectedPassword: expectedPassword,
        isValid: isValid
      };

      results.push(result);

      if (isValid) {
        successCount++;
        console.log(`✅ ${officer.gramSabhaId} (${officer.gpName}) - ${officer.subdivision} - Password: ${expectedPassword}`);
      } else {
        failCount++;
        console.log(`❌ ${officer.gramSabhaId} (${officer.gpName}) - ${officer.subdivision} - Password: ${expectedPassword}`);
      }
    }

    console.log(`\n=== Summary ===`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`📊 Success Rate: ${((successCount / allOfficers.length) * 100).toFixed(2)}%`);

    // Show some sample credentials for testing
    console.log(`\n=== Sample Credentials for Testing ===`);
    const phandaSamples = results.filter(r => r.subdivision === 'Phanda' && r.isValid).slice(0, 3);
    const berasiaSamples = results.filter(r => r.subdivision === 'Berasia' && r.isValid).slice(0, 3);

    console.log('\nPhanda Subdivision:');
    phandaSamples.forEach(r => {
      console.log(`  ID: ${r.gramSabhaId} | Password: ${r.expectedPassword} | GP: ${r.gpName}`);
    });

    console.log('\nBerasia Subdivision:');
    berasiaSamples.forEach(r => {
      console.log(`  ID: ${r.gramSabhaId} | Password: ${r.expectedPassword} | GP: ${r.gpName}`);
    });

  } catch (error) {
    console.error('Error testing credentials:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testAllGSCredentials();
