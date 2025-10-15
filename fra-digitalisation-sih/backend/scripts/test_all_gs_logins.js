/* Test ALL Gram Sabha Officer Logins */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const { Admin } = require('../model/admin.js');

async function testAllGSLogins() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== Testing ALL Gram Sabha Officer Logins ===\n');

    // Get all Gram Sabha officers
    const officers = await Admin.find({ role: 'GramSabha' }).sort({ assignedSubdivision: 1, assignedGramPanchayat: 1 });
    console.log(`Found ${officers.length} Gram Sabha officers to test\n`);

    let successCount = 0;
    let failCount = 0;
    const failedOfficers = [];

    // Test each officer
    for (const officer of officers) {
      try {
        // Test login with GP Code - need to reconstruct original password
        const originalPassword = officer.assignedGpCode.replace('GS-', '').toLowerCase() + '-2025';
        const response = await fetch('http://localhost:8000/api/gs/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            gramSabhaId: officer.assignedGpCode,
            password: originalPassword
          })
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            successCount++;
            console.log(`✅ ${officer.assignedGramPanchayat} (${officer.assignedSubdivision}): ${officer.assignedGpCode} - LOGIN SUCCESS`);
          } else {
            failCount++;
            failedOfficers.push({
              name: officer.assignedGramPanchayat,
              gpCode: officer.assignedGpCode,
              subdivision: officer.assignedSubdivision,
              reason: 'API returned success: false'
            });
            console.log(`❌ ${officer.assignedGramPanchayat} (${officer.assignedSubdivision}): ${officer.assignedGpCode} - LOGIN FAILED`);
          }
        } else {
          failCount++;
          const errorText = await response.text();
          failedOfficers.push({
            name: officer.assignedGramPanchayat,
            gpCode: officer.assignedGpCode,
            subdivision: officer.assignedSubdivision,
            reason: `HTTP ${response.status}: ${errorText}`
          });
          console.log(`❌ ${officer.assignedGramPanchayat} (${officer.assignedSubdivision}): ${officer.assignedGpCode} - LOGIN FAILED (${response.status})`);
        }
      } catch (error) {
        failCount++;
        failedOfficers.push({
          name: officer.assignedGramPanchayat,
          gpCode: officer.assignedGpCode,
          subdivision: officer.assignedSubdivision,
          reason: `Network error: ${error.message}`
        });
        console.log(`❌ ${officer.assignedGramPanchayat} (${officer.assignedSubdivision}): ${officer.assignedGpCode} - NETWORK ERROR`);
      }

      // Add small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    console.log(`\n=== Test Results ===`);
    console.log(`✅ Successful Logins: ${successCount}`);
    console.log(`❌ Failed Logins: ${failCount}`);
    console.log(`📊 Success Rate: ${((successCount / officers.length) * 100).toFixed(1)}%`);

    if (failedOfficers.length > 0) {
      console.log(`\n❌ Failed Officers (${failedOfficers.length}):`);
      failedOfficers.forEach(officer => {
        console.log(`  - ${officer.name} (${officer.subdivision}): ${officer.gpCode} - ${officer.reason}`);
      });
    }

    // Test a few specific officers manually
    console.log(`\n🧪 Manual Test of Specific Officers:`);
    const testOfficers = [
      { gpCode: 'GS-PHN-236194', password: 'phn-236194-2025', name: 'MENDORI' },
      { gpCode: 'GS-BRS-134252', password: 'brs-134252-2025', name: 'AMARPUR' },
      { gpCode: 'GS-PHN-134357', password: 'phn-134357-2025', name: 'ACHARPURA' }
    ];

    for (const testOfficer of testOfficers) {
      try {
        const response = await fetch('http://localhost:8000/api/gs/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            gramSabhaId: testOfficer.gpCode,
            password: testOfficer.password
          })
        });

        if (response.ok) {
          const result = await response.json();
          console.log(`✅ ${testOfficer.name}: ${testOfficer.gpCode} - MANUAL TEST SUCCESS`);
        } else {
          console.log(`❌ ${testOfficer.name}: ${testOfficer.gpCode} - MANUAL TEST FAILED`);
        }
      } catch (error) {
        console.log(`❌ ${testOfficer.name}: ${testOfficer.gpCode} - MANUAL TEST ERROR`);
      }
    }

  } catch (error) {
    console.error('Error testing GS logins:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testAllGSLogins();

