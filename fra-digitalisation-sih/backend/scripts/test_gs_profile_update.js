/* Test GS Profile Update API */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

async function testGSProfileUpdate() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== Testing GS Profile Update API ===\n');

    // Step 1: Login to get session
    console.log('1. Logging in...');
    const loginResponse = await fetch('http://localhost:8000/api/gs/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gramSabhaId: 'GS-PHN-236194',
        password: 'phn-236194-2025'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login Status:', loginResponse.status);
    console.log('Login Success:', loginData.success);

    if (!loginData.success) {
      console.log('Login failed, cannot test profile update');
      return;
    }

    const cookie = loginResponse.headers.get('set-cookie') || '';

    // Step 2: Get current profile
    console.log('\n2. Getting current profile...');
    const profileResponse = await fetch('http://localhost:8000/api/gs/profile', {
      method: 'GET',
      headers: {
        'Cookie': cookie
      }
    });
    
    const profileData = await profileResponse.json();
    console.log('Profile Status:', profileResponse.status);
    console.log('Current Profile:', JSON.stringify(profileData.officer, null, 2));

    // Step 3: Update profile
    console.log('\n3. Updating profile...');
    const updateData = {
      name: 'Updated Officer Name',
      email: 'updated.officer@gs.com',
      contactNumber: '9876543210',
      assignedVillage: 'Updated Village Name'
    };

    const updateResponse = await fetch('http://localhost:8000/api/gs/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie
      },
      body: JSON.stringify(updateData)
    });
    
    const updateResult = await updateResponse.json();
    console.log('Update Status:', updateResponse.status);
    console.log('Update Success:', updateResult.success);
    console.log('Update Message:', updateResult.message);
    
    if (updateResult.success) {
      console.log('Updated Profile:', JSON.stringify(updateResult.officer, null, 2));
    } else {
      console.log('Update Error:', updateResult.message);
    }

    // Step 4: Verify profile was updated
    console.log('\n4. Verifying updated profile...');
    const verifyResponse = await fetch('http://localhost:8000/api/gs/profile', {
      method: 'GET',
      headers: {
        'Cookie': cookie
      }
    });
    
    const verifyData = await verifyResponse.json();
    console.log('Verify Status:', verifyResponse.status);
    console.log('Verified Profile:', JSON.stringify(verifyData.officer, null, 2));

    console.log('\n=== Test Complete ===');

  } catch (error) {
    console.error('Error testing GS profile update:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testGSProfileUpdate();
