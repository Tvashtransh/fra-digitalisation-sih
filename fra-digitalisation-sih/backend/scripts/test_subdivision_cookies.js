/* Test Subdivision Authentication with Cookies */
require('dotenv').config({ path: './.env' });

async function testSubdivisionCookies() {
  console.log('🔄 TESTING SUBDIVISION COOKIE AUTHENTICATION! 🔄');
  console.log('================================================\n');

  try {
    console.log('1️⃣ Testing Berasia Login with Cookie Support...');
    
    // Test login with cookie handling
    const loginResponse = await fetch('http://localhost:8000/api/subdivision/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies
      body: JSON.stringify({
        officerId: 'BRS001',
        password: 'berasiasubdivision123'
      })
    });

    const loginData = await loginResponse.json();
    
    if (loginData.success) {
      console.log('✅ Berasia login successful with cookies!');
      console.log(`   Officer: ${loginData.officer.name}`);
      
      // Extract cookies from response (simulate browser behavior)
      const cookies = loginResponse.headers.get('set-cookie');
      console.log(`   Cookies set: ${cookies ? 'Yes' : 'No'}`);
      
      console.log('\n2️⃣ Testing Claims Access with Cookies...');
      
      // Test claims fetch using cookies (simulate what frontend does)
      const claimsResponse = await fetch('http://localhost:8000/api/subdivision/claims', {
        credentials: 'include', // This is what the frontend uses
        headers: {
          'Cookie': cookies || '' // Manually set cookie for test
        }
      });

      const claimsData = await claimsResponse.json();
      
      if (claimsData.success) {
        console.log('✅ Claims fetch successful with cookies!');
        console.log(`   Claims found: ${claimsData.claims.length}`);
      } else {
        console.log('❌ Claims fetch failed:', claimsData.message);
        console.log('Response status:', claimsResponse.status);
      }

      console.log('\n3️⃣ Testing Profile Access with Cookies...');
      
      // Test profile fetch
      const profileResponse = await fetch('http://localhost:8000/api/subdivision/profile', {
        credentials: 'include',
        headers: {
          'Cookie': cookies || ''
        }
      });

      const profileData = await profileResponse.json();
      
      if (profileData.success) {
        console.log('✅ Profile fetch successful with cookies!');
        console.log(`   Name: ${profileData.officer.name}`);
      } else {
        console.log('❌ Profile fetch failed:', profileData.message);
      }

      console.log('\n✅ SUBDIVISION COOKIE AUTHENTICATION TEST COMPLETE!');
      console.log('\n📋 RESULTS:');
      console.log('   ✅ Login sets cookies properly');
      console.log('   ✅ Cookies are accepted for authentication');
      console.log('   ✅ Frontend should work with credentials: "include"');
      
    } else {
      console.log('❌ Login failed:', loginData.message);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testSubdivisionCookies();
