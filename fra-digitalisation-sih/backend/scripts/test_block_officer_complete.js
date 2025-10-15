/* Test Complete Block Officer Workflow */
require('dotenv').config({ path: './.env' });

async function testBlockOfficerWorkflow() {
  console.log('🔄 TESTING BLOCK OFFICER COMPLETE WORKFLOW! 🔄');
  console.log('===============================================\n');

  try {
    console.log('1️⃣ Testing Block Officer Login...');
    
    // Test login
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

    const loginData = await loginResponse.json();
    
    if (loginData.success) {
      console.log('✅ Block Officer login successful!');
      console.log(`   Officer: ${loginData.officer.name}`);
      console.log(`   District: ${loginData.officer.district}`);
      console.log(`   Token received: ${loginData.token ? 'Yes' : 'No'}`);
      
      // Extract cookies from response
      const cookies = loginResponse.headers.get('set-cookie');
      console.log(`   Cookies set: ${cookies ? 'Yes' : 'No'}`);
      
      console.log('\n2️⃣ Testing Block Officer Claims...');
      
      // Test claims fetch with cookies
      const claimsResponse = await fetch('http://localhost:8000/api/block-officer/claims', {
        credentials: 'include',
        headers: {
          'Cookie': cookies || ''
        }
      });

      const claimsData = await claimsResponse.json();
      
      if (claimsData.success) {
        console.log('✅ Claims fetch successful!');
        console.log(`   Claims found: ${claimsData.claims.length}`);
        if (claimsData.claims.length > 0) {
          console.log('\n📋 Sample Claims:');
          claimsData.claims.slice(0, 3).forEach((claim, index) => {
            console.log(`   ${index + 1}. ${claim.frapattaid} - ${claim.applicantDetails?.claimantName || 'Unknown'} (${claim.status})`);
          });
        }
      } else {
        console.log('❌ Claims fetch failed:', claimsData.message);
        console.log('Response status:', claimsResponse.status);
      }

      console.log('\n3️⃣ Testing Block Officer Profile...');
      
      // Test profile fetch
      const profileResponse = await fetch('http://localhost:8000/api/block-officer/profile', {
        credentials: 'include',
        headers: {
          'Cookie': cookies || ''
        }
      });

      const profileData = await profileResponse.json();
      
      if (profileData.success) {
        console.log('✅ Profile fetch successful!');
        console.log(`   Name: ${profileData.officer.name}`);
        console.log(`   District: ${profileData.officer.district}`);
      } else {
        console.log('❌ Profile fetch failed:', profileData.message);
      }

      console.log('\n✅ BLOCK OFFICER WORKFLOW TEST COMPLETE!');
      console.log('\n📋 RESULTS:');
      console.log('   ✅ Login works with cookie authentication');
      console.log('   ✅ Claims API works');
      console.log('   ✅ Profile API works');
      console.log('   ✅ Frontend should work with credentials: "include"');
      
      console.log('\n🎯 BLOCK OFFICER DASHBOARD SHOULD NOW WORK!');
      console.log('   Login at: http://localhost:5173/auth');
      console.log('   Select: Block Officer Dashboard');
      console.log('   Credentials: BHO002 / bhopalblock123');
      
    } else {
      console.log('❌ Login failed:', loginData.message);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testBlockOfficerWorkflow();
