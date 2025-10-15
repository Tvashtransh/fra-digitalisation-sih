/* Seed ALL Gram Sabha Officers from Credentials Files */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const { Admin } = require('../model/admin.js');
const fs = require('fs');
const path = require('path');

async function seedAllGSOfficers() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== Seeding ALL Gram Sabha Officers ===\n');

    // Clean up existing Gram Sabha officers
    await Admin.deleteMany({ role: 'GramSabha' });
    console.log('Cleaned up existing Gram Sabha officers');

    // Read Phanda credentials
    const phandaCredentials = fs.readFileSync(path.join(__dirname, '..', 'credentials-phanda-gs.txt'), 'utf8');
    const phandaLines = phandaCredentials.split('\n').filter(line => line.includes('->'));
    
    console.log(`\n📋 Processing ${phandaLines.length} Phanda Gram Sabha Officers...`);
    
    let phandaCount = 0;
    for (const line of phandaLines) {
      const match = line.match(/([^(]+)\s*\((\d+)\)\s*->\s*ID:\s*([^\s]+)\s*PASS:\s*([^\s]+)/);
      if (match) {
        const [, gpName, gpNumber, gpCode, password] = match;
        const cleanGpName = gpName.trim();
        
        try {
          const officer = new Admin({
            name: `${cleanGpName} GS Officer`,
            email: `${cleanGpName.toLowerCase().replace(/\s+/g, '')}@gs.com`,
            password: password.trim(),
            contactNumber: '9999999999',
            role: 'GramSabha',
            assignedDistrict: 'Bhopal',
            assignedSubdivision: 'Phanda',
            assignedGramPanchayat: cleanGpName,
            assignedGpCode: gpCode.trim()
          });
          
          await officer.save();
          phandaCount++;
          console.log(`✅ ${cleanGpName}: ${gpCode.trim()} / ${password.trim()}`);
        } catch (error) {
          console.error(`❌ Error creating ${cleanGpName}:`, error.message);
        }
      }
    }

    // Read Berasia credentials
    const berasiaCredentials = fs.readFileSync(path.join(__dirname, '..', 'credentials-berasia-gs.txt'), 'utf8');
    const berasiaLines = berasiaCredentials.split('\n').filter(line => line.includes('->'));
    
    console.log(`\n📋 Processing ${berasiaLines.length} Berasia Gram Sabha Officers...`);
    
    let berasiaCount = 0;
    for (const line of berasiaLines) {
      const match = line.match(/([^(]+)\s*\((\d+)\)\s*->\s*ID:\s*([^\s]+)\s*PASS:\s*([^\s]+)/);
      if (match) {
        const [, gpName, gpNumber, gpCode, password] = match;
        const cleanGpName = gpName.trim();
        
        try {
          const officer = new Admin({
            name: `${cleanGpName} GS Officer`,
            email: `${cleanGpName.toLowerCase().replace(/\s+/g, '')}@gs.com`,
            password: password.trim(),
            contactNumber: '9999999999',
            role: 'GramSabha',
            assignedDistrict: 'Bhopal',
            assignedSubdivision: 'Berasia',
            assignedGramPanchayat: cleanGpName,
            assignedGpCode: gpCode.trim()
          });
          
          await officer.save();
          berasiaCount++;
          console.log(`✅ ${cleanGpName}: ${gpCode.trim()} / ${password.trim()}`);
        } catch (error) {
          console.error(`❌ Error creating ${cleanGpName}:`, error.message);
        }
      }
    }

    console.log(`\n=== Seeding Complete ===`);
    console.log(`✅ Phanda Officers Created: ${phandaCount}`);
    console.log(`✅ Berasia Officers Created: ${berasiaCount}`);
    console.log(`✅ Total Officers: ${phandaCount + berasiaCount}`);

    // Test a few random logins to verify they work
    console.log(`\n🧪 Testing Random Logins...`);
    
    const testOfficers = await Admin.find({ role: 'GramSabha' }).limit(5);
    for (const officer of testOfficers) {
      try {
        const testMatch = await officer.comparePassword(officer.password);
        console.log(`✅ ${officer.assignedGramPanchayat}: Login test ${testMatch ? 'PASSED' : 'FAILED'}`);
      } catch (error) {
        console.log(`❌ ${officer.assignedGramPanchayat}: Login test FAILED - ${error.message}`);
      }
    }

  } catch (error) {
    console.error('Error seeding all GS officers:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedAllGSOfficers();

