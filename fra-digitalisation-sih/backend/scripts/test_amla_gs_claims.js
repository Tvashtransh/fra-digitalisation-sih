/* Test AMLA GS officer can see AMLA claims */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

async function testAmlaGSClaims() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== Testing AMLA GS Officer Claims Visibility ===\n');

    // Step 1: Login as AMLA GS officer
    console.log('1. Logging in as AMLA GS officer...');
    const loginResponse = await fetch('http://localhost:8000/api/gs/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gramSabhaId: 'GS-PHN-134363', // AMLA GS officer
        password: 'phn-134363-2025'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login Status:', loginResponse.status);
    console.log('Login Success:', loginData.success);

    if (!loginData.success) {
      console.log('Login failed, cannot test AMLA GS claims');
      return;
    }

    const cookie = loginResponse.headers.get('set-cookie') || '';

    // Step 2: Get AMLA GS officer profile
    console.log('\n2. Getting AMLA GS officer profile...');
    const profileResponse = await fetch('http://localhost:8000/api/gs/profile', {
      method: 'GET',
      headers: {
        'Cookie': cookie
      }
    });
    
    const profileData = await profileResponse.json();
    console.log('Profile Status:', profileResponse.status);
    console.log('Officer GP Code:', profileData.officer?.gpCode);
    console.log('Officer GP Name:', profileData.officer?.gpName);

    // Step 3: Get claims for AMLA GS officer
    console.log('\n3. Getting claims for AMLA GS officer...');
    const claimsResponse = await fetch('http://localhost:8000/api/gs/claims', {
      method: 'GET',
      headers: {
        'Cookie': cookie
      }
    });
    
    const claimsData = await claimsResponse.json();
    console.log('Claims Status:', claimsResponse.status);
    console.log('Claims Success:', claimsData.success);
    console.log('Claims Count:', claimsData.claims ? claimsData.claims.length : 0);

    if (claimsData.claims && claimsData.claims.length > 0) {
      console.log('\nClaims found:');
      claimsData.claims.forEach((claim, index) => {
        console.log(`${index + 1}. FRA ID: ${claim.frapattaid}`);
        console.log(`   Gram Panchayat: ${claim.gramPanchayat}`);
        console.log(`   GP Code: ${claim.gpCode}`);
        console.log(`   Status: ${claim.status}`);
        console.log(`   Claimant: ${claim.claimant?.name || 'Unknown'}`);
        console.log('');
      });
    } else {
      console.log('No claims found for AMLA GS officer');
    }

    // Step 4: Check if AMLA claim is visible
    console.log('\n4. Checking for AMLA claim specifically...');
    const amlaClaim = claimsData.claims?.find(claim => 
      claim.gramPanchayat?.toLowerCase().includes('amla') || 
      claim.gpCode === 'GS-PHN-134363'
    );

    if (amlaClaim) {
      console.log('✅ SUCCESS: AMLA claim is visible to AMLA GS officer!');
      console.log(`   FRA ID: ${amlaClaim.frapattaid}`);
      console.log(`   GP Code: ${amlaClaim.gpCode}`);
    } else {
      console.log('❌ ERROR: AMLA claim is NOT visible to AMLA GS officer');
    }

    console.log('\n=== Test Complete ===');

  } catch (error) {
    console.error('Error testing AMLA GS claims:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testAmlaGSClaims();
