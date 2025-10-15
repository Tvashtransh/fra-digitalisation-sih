/* Test Complete Block Officer Login Flow */
require('dotenv').config({ path: './.env' });

async function testBlockOfficerLoginFlow() {
  console.log('🔄 TESTING BLOCK OFFICER LOGIN FLOW! 🔄');
  console.log('========================================\n');

  try {
    console.log('1️⃣ Testing Server Connection...');
    
    // Test if server is running
    try {
      const serverResponse = await fetch('http://localhost:8000/');
      console.log('✅ Server is running on port 8000');
    } catch (error) {
      console.log('❌ Server not running on port 8000!');
      console.log('   Please run: cd fra-digitalisation-sih/backend && node index.js');
      return;
    }

    console.log('\n2️⃣ Testing Block Officer Login...');
    
    // Test login endpoint
    const loginResponse = await fetch('http://localhost:8000/api/block-officer/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        officerId: 'BHO002',
        password: 'bhopalblock123'
      })
    });

    if (!loginResponse.ok) {
      console.log('❌ Login failed with status:', loginResponse.status);
      const errorData = await loginResponse.json();
      console.log('   Error:', errorData.message);
      return;
    }

    const loginData = await loginResponse.json();
    
    if (loginData.success) {
      console.log('✅ Block Officer login successful!');
      console.log(`   Officer: ${loginData.officer.name}`);
      console.log(`   District: ${loginData.officer.district}`);
      console.log(`   District ID: ${loginData.officer.districtId}`);
      
      // Extract cookies
      const cookies = loginResponse.headers.get('set-cookie');
      console.log(`   Cookies set: ${cookies ? 'Yes' : 'No'}`);
      
      console.log('\n3️⃣ Testing Claims Access...');
      
      // Test claims with cookies
      const claimsResponse = await fetch('http://localhost:8000/api/block-officer/claims', {
        credentials: 'include',
        headers: cookies ? { 'Cookie': cookies } : {}
      });

      if (!claimsResponse.ok) {
        console.log('❌ Claims fetch failed with status:', claimsResponse.status);
        const errorData = await claimsResponse.json();
        console.log('   Error:', errorData.message);
      } else {
        const claimsData = await claimsResponse.json();
        if (claimsData.success) {
          console.log('✅ Claims fetch successful!');
          console.log(`   Claims found: ${claimsData.claims.length}`);
        } else {
          console.log('❌ Claims fetch error:', claimsData.message);
        }
      }

      console.log('\n🎯 FRONTEND INSTRUCTIONS:');
      console.log('1. Go to: http://localhost:5173/auth');
      console.log('2. Select: "Block Officer Dashboard"');
      console.log('3. Login with:');
      console.log('   - Officer ID: BHO002');
      console.log('   - Password: bhopalblock123');
      console.log('4. After login, navigate to "Claim Management"');
      console.log('5. You should see real claims data');
      
    } else {
      console.log('❌ Login failed:', loginData.message);
    }

  } catch (error) {
    console.error('❌ Network Error:', error.message);
    console.log('\n🔧 TROUBLESHOOTING:');
    console.log('1. Make sure backend server is running:');
    console.log('   cd fra-digitalisation-sih/backend');
    console.log('   node index.js');
    console.log('2. Make sure frontend is running:');
    console.log('   cd fra-digitalisation-sih/frontend');
    console.log('   npm start');
  }
}

testBlockOfficerLoginFlow();
