/* Test Map Save Endpoint */
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testMapSave() {
  try {
    console.log('Testing Map Save Endpoint...');
    console.log('============================');
    
    // First, login as GS officer
    console.log('1. Logging in as GS officer...');
    const loginResponse = await fetch('http://localhost:8000/api/gs/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gramSabhaId: 'GS-PHN-134363',
        password: 'phn-134363-2025'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData.success ? 'SUCCESS' : 'FAILED');
    
    if (!loginData.success) {
      console.log('Login failed:', loginData.message);
      return;
    }
    
    // Extract cookie from response headers
    const setCookieHeader = loginResponse.headers.get('set-cookie');
    console.log('Set-Cookie header:', setCookieHeader);
    
    if (!setCookieHeader) {
      console.log('No cookie received');
      return;
    }
    
    // Extract gs_token from cookie
    const tokenMatch = setCookieHeader.match(/gs_token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;
    console.log('Token extracted:', token ? 'YES' : 'NO');
    
    // Get claims
    console.log('\n2. Fetching claims...');
    const claimsResponse = await fetch('http://localhost:8000/api/gs/claims', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `gs_token=${token}`
      }
    });
    
    const claimsData = await claimsResponse.json();
    console.log('Claims response:', claimsData.success ? 'SUCCESS' : 'FAILED');
    console.log('Number of claims:', claimsData.claims ? claimsData.claims.length : 0);
    
    if (!claimsData.claims || claimsData.claims.length === 0) {
      console.log('No claims found to test with');
      return;
    }
    
    const testClaim = claimsData.claims[0];
    console.log('Testing with claim:', testClaim.frapattaid || testClaim._id);
    console.log('Claim ID for API:', testClaim._id);
    
    // Test map save
    console.log('\n3. Testing map save...');
    const mapData = {
      areas: [{
        id: 'test-area-1',
        area: 1000,
        type: 'polygon',
        geojson: {
          type: 'Polygon',
          coordinates: [[[77.4, 23.2], [77.5, 23.2], [77.5, 23.3], [77.4, 23.3], [77.4, 23.2]]]
        }
      }],
      totalArea: 1000
    };
    
    const saveResponse = await fetch(`http://localhost:8000/api/gs/claims/${testClaim._id}/map`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `gs_token=${token}`
      },
      body: JSON.stringify({ mapData })
    });
    
    const saveData = await saveResponse.json();
    console.log('Save response status:', saveResponse.status);
    console.log('Save response:', saveData);
    
    if (saveData.success) {
      console.log('✅ Map save test PASSED!');
    } else {
      console.log('❌ Map save test FAILED:', saveData.message);
    }
    
  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testMapSave();
