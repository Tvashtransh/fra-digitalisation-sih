/* Test Berasia Subdivision Officer */
require('dotenv').config({ path: './.env' });

async function testBerasiaSubdivision() {
  console.log('🔄 TESTING BERASIA SUBDIVISION OFFICER! 🔄');
  console.log('==========================================\n');

  try {
    console.log('1️⃣ Testing Berasia Subdivision Login...');
    
    // Test login
    const loginResponse = await fetch('http://localhost:8000/api/subdivision/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        officerId: 'BRS001',
        password: 'berasiasubdivision123'
      })
    });

    const loginData = await loginResponse.json();
    
    if (loginData.success) {
      console.log('✅ Berasia login successful!');
      console.log(`   Officer: ${loginData.officer.name}`);
      console.log(`   Subdivision: ${loginData.officer.subdivision}`);
      
      const token = loginData.token;
      
      console.log('\n2️⃣ Testing Berasia Claims...');
      
      // Test claims fetch
      const claimsResponse = await fetch('http://localhost:8000/api/subdivision/claims', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const claimsData = await claimsResponse.json();
      
      if (claimsData.success) {
        console.log('✅ Berasia claims fetch successful!');
        console.log(`   Claims found: ${claimsData.claims.length}`);
        
        if (claimsData.claims.length > 0) {
          console.log('\n📋 Claims Details:');
          claimsData.claims.forEach((claim, index) => {
            console.log(`   ${index + 1}. ${claim.frapattaid} - ${claim.applicantDetails?.claimantName} (${claim.status})`);
          });
        } else {
          console.log('   ℹ️ No claims found for Berasia subdivision');
        }
      } else {
        console.log('❌ Berasia claims fetch failed:', claimsData.message);
      }

      console.log('\n✅ BERASIA SUBDIVISION TEST COMPLETE!');
      
    } else {
      console.log('❌ Berasia login failed:', loginData.message);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testBerasiaSubdivision();
