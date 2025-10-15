/* Seed Real Gram Sabha Officers with Correct Credentials */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const { Admin } = require('../model/admin.js');

async function seedRealGSOfficers() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== Seeding Real Gram Sabha Officers ===\n');

    // Clean up existing test admins
    await Admin.deleteMany({ email: { $regex: 'test@' } });
    console.log('Cleaned up test admins');

    // Real Gram Sabha officers from Phanda subdivision
    const phandaOfficers = [
      { name: 'ACHARPURA GS Officer', gpCode: 'GS-PHN-134357', password: 'phn-134357-2025', gpName: 'ACHARPURA' },
      { name: 'ADAMPUR CHAWANI GS Officer', gpCode: 'GS-PHN-134358', password: 'phn-134358-2025', gpName: 'ADAMPUR CHAWANI' },
      { name: 'AGARIYA GS Officer', gpCode: 'GS-PHN-134359', password: 'phn-134359-2025', gpName: 'AGARIYA' },
      { name: 'AMJHARA GS Officer', gpCode: 'GS-PHN-134360', password: 'phn-134360-2025', gpName: 'AMJHARA' },
      { name: 'AMLA GS Officer', gpCode: 'GS-PHN-134363', password: 'phn-134363-2025', gpName: 'AMLA' },
      { name: 'MENDORI GS Officer', gpCode: 'GS-PHN-236194', password: 'phn-236194-2025', gpName: 'MENDORI' }
    ];

    for (const officerData of phandaOfficers) {
      try {
        const officer = new Admin({
          name: officerData.name,
          email: `${officerData.gpName.toLowerCase().replace(/\s+/g, '')}@gs.com`,
          password: officerData.password,
          contactNumber: '9999999999',
          role: 'GramSabha',
          assignedDistrict: 'Bhopal',
          assignedSubdivision: 'Phanda',
          assignedGramPanchayat: officerData.gpName,
          assignedGpCode: officerData.gpCode
        });
        
        await officer.save();
        console.log(`✅ Created ${officerData.name} - ID: ${officerData.gpCode}, PASS: ${officerData.password}`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`⚠️  ${officerData.name} already exists - ID: ${officerData.gpCode}, PASS: ${officerData.password}`);
        } else {
          console.error(`❌ Error creating ${officerData.name}:`, error.message);
        }
      }
    }

    // Real Gram Sabha officers from Berasia subdivision
    const berasiaOfficers = [
      { name: 'AMARPUR GS Officer', gpCode: 'GS-BER-134252', password: 'ber-134252-2025', gpName: 'AMARPUR' },
      { name: 'BAGROD GS Officer', gpCode: 'GS-BER-134253', password: 'ber-134253-2025', gpName: 'BAGROD' },
      { name: 'BANJARI GS Officer', gpCode: 'GS-BER-134254', password: 'ber-134254-2025', gpName: 'BANJARI' }
    ];

    for (const officerData of berasiaOfficers) {
      try {
        const officer = new Admin({
          name: officerData.name,
          email: `${officerData.gpName.toLowerCase().replace(/\s+/g, '')}@gs.com`,
          password: officerData.password,
          contactNumber: '9999999999',
          role: 'GramSabha',
          assignedDistrict: 'Bhopal',
          assignedSubdivision: 'Berasia',
          assignedGramPanchayat: officerData.gpName,
          assignedGpCode: officerData.gpCode
        });
        
        await officer.save();
        console.log(`✅ Created ${officerData.name} - ID: ${officerData.gpCode}, PASS: ${officerData.password}`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`⚠️  ${officerData.name} already exists - ID: ${officerData.gpCode}, PASS: ${officerData.password}`);
        } else {
          console.error(`❌ Error creating ${officerData.name}:`, error.message);
        }
      }
    }

    console.log('\n=== Real Gram Sabha Officers Created ===');
    console.log('\nPhanda Subdivision Officers:');
    phandaOfficers.forEach(o => console.log(`  ${o.gpName}: ${o.gpCode} / ${o.password}`));
    
    console.log('\nBerasia Subdivision Officers:');
    berasiaOfficers.forEach(o => console.log(`  ${o.gpName}: ${o.gpCode} / ${o.password}`));

  } catch (error) {
    console.error('Error seeding real GS officers:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedRealGSOfficers();
