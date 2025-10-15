/* Test map functionality for GS officers */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

async function testMapFunctionality() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== Testing Map Functionality ===\n');

    // Step 1: Login as GS officer
    console.log('1. Logging in as GS officer...');
    const loginResponse = await fetch('http://localhost:8000/api/gs/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gramSabhaId: 'GS-PHN-134363', // AMLA GS officer
        password: 'phn-134363-2025'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login Status:', loginResponse.status);
    console.log('Login Success:', loginData.success);

    if (!loginData.success) {
      console.log('Login failed, cannot test map functionality');
      return;
    }

    const cookie = loginResponse.headers.get('set-cookie') || '';

    // Step 2: Get claims
    console.log('\n2. Getting claims...');
    const claimsResponse = await fetch('http://localhost:8000/api/gs/claims', {
      method: 'GET',
      headers: {
        'Cookie': cookie
      }
    });
    
    const claimsData = await claimsResponse.json();
    console.log('Claims Status:', claimsResponse.status);
    console.log('Claims Count:', claimsData.claims ? claimsData.claims.length : 0);

    if (!claimsData.claims || claimsData.claims.length === 0) {
      console.log('No claims found to test map functionality');
      return;
    }

    const testClaim = claimsData.claims[0];
    console.log(`\nTesting with claim: ${testClaim.frapattaid}`);

    // Step 3: Test map data saving
    console.log('\n3. Testing map data saving...');
    const mapData = {
      areas: [
        {
          id: 'area_001',
          area: 10000, // 1 hectare in square meters
          type: 'polygon',
          geojson: {
            type: 'Polygon',
            coordinates: [[
              [77.4126, 23.2599],
              [77.4136, 23.2599],
              [77.4136, 23.2609],
              [77.4126, 23.2609],
              [77.4126, 23.2599]
            ]]
          }
        }
      ],
      totalArea: 10000
    };

    const saveMapResponse = await fetch(`http://localhost:8000/api/gs/claims/${testClaim._id}/map`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie
      },
      body: JSON.stringify({ mapData })
    });
    
    const saveMapData = await saveMapResponse.json();
    console.log('Save Map Status:', saveMapResponse.status);
    console.log('Save Map Success:', saveMapData.success);
    console.log('Save Map Message:', saveMapData.message);

    if (saveMapData.success) {
      console.log('✅ Map data saved successfully!');
      console.log('Updated claim status:', saveMapData.claim.status);
    } else {
      console.log('❌ Failed to save map data:', saveMapData.message);
    }

    // Step 4: Verify claim was updated
    console.log('\n4. Verifying claim was updated...');
    const updatedClaimsResponse = await fetch('http://localhost:8000/api/gs/claims', {
      method: 'GET',
      headers: {
        'Cookie': cookie
      }
    });
    
    const updatedClaimsData = await updatedClaimsResponse.json();
    const updatedClaim = updatedClaimsData.claims.find(c => c._id === testClaim._id);
    
    if (updatedClaim) {
      console.log('Updated claim status:', updatedClaim.status);
      console.log('Has map data:', !!updatedClaim.mapData);
      if (updatedClaim.mapData) {
        console.log('Map areas count:', updatedClaim.mapData.areas.length);
        console.log('Total mapped area:', updatedClaim.mapData.totalArea, 'm²');
      }
    }

    console.log('\n=== Test Complete ===');

  } catch (error) {
    console.error('Error testing map functionality:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testMapFunctionality();
