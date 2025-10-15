/* Test GS Claims Filtering - Verify officers only see their respective claims */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

async function testGSClaimsFiltering() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== Testing GS Claims Filtering ===\n');

    // Test different GS officers from different areas
    const testOfficers = [
      { gpCode: 'GS-PHN-236194', password: 'phn-236194-2025', name: 'MENDORI (Phanda)' },
      { gpCode: 'GS-BRS-134252', password: 'brs-134252-2025', name: 'AMARPUR (Berasia)' },
      { gpCode: 'GS-PHN-134357', password: 'phn-134357-2025', name: 'ACHARPURA (Phanda)' }
    ];

    for (const officer of testOfficers) {
      try {
        console.log(`\n🔍 Testing ${officer.name} (${officer.gpCode}):`);
        
        // Login
        const loginResponse = await fetch('http://localhost:8000/api/gs/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            gramSabhaId: officer.gpCode,
            password: officer.password
          })
        });
        
        if (!loginResponse.ok) {
          console.log(`❌ Login failed: ${loginResponse.status}`);
          continue;
        }
        
        const loginData = await loginResponse.json();
        console.log(`✅ Login successful`);
        
        // Get claims
        const cookie = loginResponse.headers.get('set-cookie');
        const claimsResponse = await fetch('http://localhost:8000/api/gs/claims', {
          headers: {
            'Cookie': cookie
          }
        });
        
        if (!claimsResponse.ok) {
          console.log(`❌ Claims API failed: ${claimsResponse.status}`);
          continue;
        }
        
        const claimsData = await claimsResponse.json();
        console.log(`📊 Claims found: ${claimsData.claims ? claimsData.claims.length : 0}`);
        console.log(`🏛️ Officer GP Code: ${claimsData.officer ? claimsData.officer.gpCode : 'N/A'}`);
        console.log(`📍 Officer Area: ${claimsData.officer ? claimsData.officer.gpName : 'N/A'}, ${claimsData.officer ? claimsData.officer.subdivision : 'N/A'}`);
        
        // Verify all claims belong to this officer's area
        if (claimsData.claims && claimsData.claims.length > 0) {
          const allClaimsInArea = claimsData.claims.every(claim => claim.gpCode === officer.gpCode);
          console.log(`✅ All claims in officer's area: ${allClaimsInArea ? 'YES' : 'NO'}`);
          
          if (!allClaimsInArea) {
            console.log('❌ Found claims outside officer jurisdiction!');
            claimsData.claims.forEach(claim => {
              if (claim.gpCode !== officer.gpCode) {
                console.log(`   - Claim ${claim._id}: gpCode=${claim.gpCode}, expected=${officer.gpCode}`);
              }
            });
          }
        } else {
          console.log('ℹ️ No claims found for this officer');
        }
        
      } catch (error) {
        console.log(`❌ Error testing ${officer.name}: ${error.message}`);
      }
    }

    console.log('\n=== Test Complete ===');

  } catch (error) {
    console.error('Error testing GS claims filtering:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testGSClaimsFiltering();
