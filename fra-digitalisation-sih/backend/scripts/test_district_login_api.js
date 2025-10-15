/* Test District Officer Login API */
const fetch = require('node-fetch');

async function testDistrictLoginAPI() {
  try {
    console.log('🧪 Testing District Officer Login API...\n');

    // Test BHO001 login
    console.log('Testing BHO001 / bhopaldistrict123...');
    const response = await fetch('http://localhost:8000/api/district/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        officerId: 'BHO001',
        password: 'bhopaldistrict123'
      })
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ BHO001 Login Successful!');
      console.log('   Officer:', data.officer.name);
      console.log('   District:', data.officer.district);
      console.log('   Role:', data.officer.role);
      console.log('   Token received:', data.token ? 'Yes' : 'No');
    } else {
      console.log('❌ BHO001 Login Failed:');
      console.log('   Status:', response.status);
      console.log('   Message:', data.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test BHO002 login
    console.log('Testing BHO002 / bhopalblock123...');
    const response2 = await fetch('http://localhost:8000/api/district/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        officerId: 'BHO002',
        password: 'bhopalblock123'
      })
    });

    const data2 = await response2.json();
    
    if (response2.ok && data2.success) {
      console.log('✅ BHO002 Login Successful!');
      console.log('   Officer:', data2.officer.name);
      console.log('   District:', data2.officer.district);
      console.log('   Role:', data2.officer.role);
      console.log('   Token received:', data2.token ? 'Yes' : 'No');
    } else {
      console.log('❌ BHO002 Login Failed:');
      console.log('   Status:', response2.status);
      console.log('   Message:', data2.message);
    }

    console.log('\n🎉 District Officer Login API Test Complete!');

  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

testDistrictLoginAPI();
