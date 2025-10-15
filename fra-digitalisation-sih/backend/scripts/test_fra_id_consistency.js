/* Test FRA ID consistency between profile and claims */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

async function testFRAIdConsistency() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== Testing FRA ID Consistency ===\n');

    // Step 1: Login as a user
    console.log('1. Logging in as user...');
    const loginResponse = await fetch('http://localhost:8000/api/claimant/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        aadhaarNumber: '789456130145', // Dharam Bhai's Aadhaar
        password: 'password123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login Status:', loginResponse.status);
    console.log('Login Success:', loginData.success);

    if (!loginData.success) {
      console.log('Login failed, cannot test FRA ID consistency');
      return;
    }

    const cookie = loginResponse.headers.get('set-cookie') || '';

    // Step 2: Check profile FRA ID before claim
    console.log('\n2. Checking profile FRA ID before claim...');
    const profileResponse = await fetch('http://localhost:8000/api/claimant/profile', {
      method: 'GET',
      headers: {
        'Cookie': cookie
      }
    });
    
    const profileData = await profileResponse.json();
    console.log('Profile FRA ID before claim:', profileData.claimant.fraId);

    // Step 3: Create a test claim
    console.log('\n3. Creating test claim...');
    const claimData = {
      claimType: 'Individual',
      forestLandArea: 2.5,
      ifrData: {
        applicantDetails: {
          claimantName: 'Dharam Bhai',
          village: 'Borkheda',
          tehsil: 'Berasia',
          district: 'Bhopal',
          gramPanchayat: 'BARKHEDA YAKUB'
        },
        eligibilityStatus: {
          isST: true,
          isOTFD: false
        },
        landDetails: {
          extentHabitation: 1.0,
          extentSelfCultivation: 1.5,
          totalAreaClaimed: 2.5
        }
      }
    };

    const claimResponse = await fetch('http://localhost:8000/api/create-claim', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie
      },
      body: JSON.stringify(claimData)
    });
    
    const claimResult = await claimResponse.json();
    console.log('Claim Status:', claimResponse.status);
    console.log('Claim Success:', claimResult.claimId ? 'Yes' : 'No');
    console.log('Claim FRA ID:', claimResult.frapattaid);

    // Step 4: Check profile FRA ID after claim
    console.log('\n4. Checking profile FRA ID after claim...');
    const profileResponse2 = await fetch('http://localhost:8000/api/claimant/profile', {
      method: 'GET',
      headers: {
        'Cookie': cookie
      }
    });
    
    const profileData2 = await profileResponse2.json();
    console.log('Profile FRA ID after claim:', profileData2.claimant.fraId);

    // Step 5: Verify consistency
    console.log('\n5. Verifying FRA ID consistency...');
    const claimFRAId = claimResult.frapattaid;
    const profileFRAId = profileData2.claimant.fraId;
    
    if (claimFRAId === profileFRAId) {
      console.log('✅ SUCCESS: FRA IDs are consistent!');
      console.log(`Both FRA IDs: ${claimFRAId}`);
    } else {
      console.log('❌ ERROR: FRA IDs are inconsistent!');
      console.log(`Claim FRA ID: ${claimFRAId}`);
      console.log(`Profile FRA ID: ${profileFRAId}`);
    }

    console.log('\n=== Test Complete ===');

  } catch (error) {
    console.error('Error testing FRA ID consistency:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testFRAIdConsistency();
