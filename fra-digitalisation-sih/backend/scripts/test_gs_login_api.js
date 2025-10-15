/* Test Gram Sabha Login API */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

async function testGSLoginAPI() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== Testing Gram Sabha Login API ===\n');

    // Test 1: Login with email
    console.log('1. Testing login with email:');
    const response1 = await fetch('http://localhost:8000/api/gs/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gramSabhaId: 'mendori@gs.com',
        password: 'phn-236194-2025'
      })
    });
    
    const result1 = await response1.json();
    console.log('Status:', response1.status);
    console.log('Response:', result1);

    // Test 2: Login with GP Code
    console.log('\n2. Testing login with GP Code:');
    const response2 = await fetch('http://localhost:8000/api/gs/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gramSabhaId: 'GS-PHN-236194',
        password: 'phn-236194-2025'
      })
    });
    
    const result2 = await response2.json();
    console.log('Status:', response2.status);
    console.log('Response:', result2);

    // Test 3: Test profile endpoint
    if (result1.success) {
      console.log('\n3. Testing profile endpoint:');
      const response3 = await fetch('http://localhost:8000/api/gs/profile', {
        method: 'GET',
        headers: {
          'Cookie': response1.headers.get('set-cookie') || ''
        }
      });
      
      const result3 = await response3.json();
      console.log('Status:', response3.status);
      console.log('Response:', result3);
    }

    console.log('\n=== Test Complete ===');

  } catch (error) {
    console.error('Error testing GS login API:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testGSLoginAPI();
