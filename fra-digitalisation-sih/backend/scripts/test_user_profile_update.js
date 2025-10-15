/* Test User Profile Update API */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

async function testUserProfileUpdate() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== Testing User Profile Update API ===\n');

    // Step 1: Login as a user to get session
    console.log('1. Logging in as user...');
    const loginResponse = await fetch('http://localhost:8000/api/claimant/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        aadhaarNumber: '789456130145', // Use Dharam Bhai's Aadhaar
        password: 'password123'
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
    const profileResponse = await fetch('http://localhost:8000/api/claimant/profile', {
      method: 'GET',
      headers: {
        'Cookie': cookie
      }
    });
    
    const profileData = await profileResponse.json();
    console.log('Profile Status:', profileResponse.status);
    console.log('Current Profile:', JSON.stringify(profileData.claimant, null, 2));

    // Step 3: Update profile
    console.log('\n3. Updating profile...');
    const updateData = {
      name: 'Dharam Bhai Updated',
      email: 'dharam.bhai@example.com',
      contactNumber: '9876543210',
      village: 'Updated Village',
      district: 'Updated District',
      state: 'Madhya Pradesh',
      dateOfBirth: '1985-03-15',
      gender: 'Male',
      occupation: 'Farmer',
      address: 'Updated Address',
      gramPanchayat: 'Updated GP',
      tehsil: 'Updated Tehsil',
      tribeCategory: 'ST'
    };

    const updateResponse = await fetch('http://localhost:8000/api/claimant/profile', {
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
      console.log('Updated Profile:', JSON.stringify(updateResult.claimant, null, 2));
    } else {
      console.log('Update Error:', updateResult.message);
    }

    // Step 4: Verify profile was updated
    console.log('\n4. Verifying updated profile...');
    const verifyResponse = await fetch('http://localhost:8000/api/claimant/profile', {
      method: 'GET',
      headers: {
        'Cookie': cookie
      }
    });
    
    const verifyData = await verifyResponse.json();
    console.log('Verify Status:', verifyResponse.status);
    console.log('Verified Profile:', JSON.stringify(verifyData.claimant, null, 2));

    console.log('\n=== Test Complete ===');

  } catch (error) {
    console.error('Error testing user profile update:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testUserProfileUpdate();
