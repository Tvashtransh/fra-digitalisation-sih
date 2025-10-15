/* Debug Block Officer Authentication Issue */
require('dotenv').config({ path: './.env' });

async function debugBlockOfficerAuth() {
  console.log('🔍 DEBUGGING BLOCK OFFICER AUTHENTICATION ISSUE! 🔍');
  console.log('==================================================\n');

  try {
    console.log('1️⃣ Testing Direct Claims Access (Should Fail)...');
    
    // Test claims without login (should fail with 401)
    const directResponse = await fetch('http://localhost:8000/api/block-officer/claims', {
      credentials: 'include'
    });
    
    const directResult = await directResponse.json();
    console.log(`   Status: ${directResponse.status}`);
    console.log(`   Response: ${JSON.stringify(directResult)}`);
    console.log(`   ❌ Expected: 401 Unauthorized (${directResponse.status === 401 ? 'CORRECT' : 'WRONG'})\n`);

    console.log('2️⃣ Testing Login Flow...');
    
    // Test login and capture cookies
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

    console.log(`   Login Status: ${loginResponse.status}`);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log(`   ✅ Login successful: ${loginData.officer.name}`);
      
      // Get cookies from response
      const setCookieHeader = loginResponse.headers.get('set-cookie');
      console.log(`   Cookies set by server: ${setCookieHeader ? 'YES' : 'NO'}`);
      if (setCookieHeader) {
        console.log(`   Cookie details: ${setCookieHeader}`);
      }
      
      console.log('\n3️⃣ Testing Claims Access After Login...');
      
      // Test claims with cookies from login
      const claimsResponse = await fetch('http://localhost:8000/api/block-officer/claims', {
        credentials: 'include',
        headers: setCookieHeader ? {
          'Cookie': setCookieHeader.split(';')[0] // Use the cookie from login
        } : {}
      });
      
      console.log(`   Claims Status: ${claimsResponse.status}`);
      
      if (claimsResponse.ok) {
        const claimsData = await claimsResponse.json();
        console.log(`   ✅ Claims fetch successful: ${claimsData.claims.length} claims`);
      } else {
        const claimsError = await claimsResponse.json();
        console.log(`   ❌ Claims fetch failed: ${claimsError.message}`);
      }
      
    } else {
      const loginError = await loginResponse.json();
      console.log(`   ❌ Login failed: ${loginError.message}`);
    }

    console.log('\n🔧 DIAGNOSIS:');
    console.log('The user is seeing "Error Loading Claims" because:');
    console.log('1. They accessed /block-officer-dashboard directly without login');
    console.log('2. OR the frontend login didn\'t properly authenticate with backend');
    console.log('3. OR browser is not sending cookies with the claims request');
    
    console.log('\n💡 SOLUTION:');
    console.log('User MUST login through the auth page:');
    console.log('1. Go to: http://localhost:5173/auth');
    console.log('2. Select: "Block Officer Dashboard"');
    console.log('3. Enter: BHO002 / bhopalblock123');
    console.log('4. Let the login redirect to dashboard');
    console.log('5. DON\'T manually navigate to /block-officer-dashboard');

  } catch (error) {
    console.error('❌ Debug Error:', error.message);
  }
}

debugBlockOfficerAuth();
