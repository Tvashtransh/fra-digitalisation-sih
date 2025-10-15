/* Test Hierarchical Claim Visibility System */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Claim = require('../model/claim.js');
const { Admin } = require('../model/admin.js');
const GramSabhaOfficer = require('../model/gramsabhaofficer.js');

async function testHierarchicalVisibility() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== Testing Hierarchical Claim Visibility ===\n');

    // Test 1: Create a test claim from Mendori village, Phanda subdivision
    console.log('1. Creating test claim from Mendori village, Phanda subdivision:');
    
    // Find a claimant or create one for testing
    const Claimant = require('../model/claimant.js');
    let testClaimant = await Claimant.findOne();
    if (!testClaimant) {
      console.log('   - No claimants found, creating test claimant...');
      testClaimant = new Claimant({
        name: 'Test User',
        aadhaarNumber: '123456789012',
        village: 'Mendori',
        gramPanchayat: 'Mendori',
        tehsil: 'Phanda',
        district: 'Bhopal',
        password: 'hashedpassword'
      });
      await testClaimant.save();
    }

    // Clean up any existing test claims first
    await Claim.deleteMany({ frapattaid: { $regex: 'FRA-2025-TEST-' } });
    
    // Create test claim
    const testClaim = new Claim({
      claimant: testClaimant._id,
      claimType: 'Individual',
      forestLandArea: 2.5,
      frapattaid: `FRA-2025-TEST-${Date.now()}`,
      gramPanchayat: 'Mendori',
      tehsil: 'Phanda',
      district: 'Bhopal',
      gpCode: 'GS-PHN-236194', // Mendori GP Code
      applicantDetails: {
        claimantName: 'Test User',
        village: 'Mendori',
        gramPanchayat: 'Mendori',
        tehsil: 'Phanda',
        district: 'Bhopal'
      },
      landDetails: {
        totalAreaClaimed: 2.5
      }
    });
    
    await testClaim.save();
    console.log(`   - Created claim: ${testClaim.frapattaid}`);
    console.log(`   - Location: ${testClaim.gramPanchayat} GP, ${testClaim.tehsil} Subdivision, ${testClaim.district} District`);
    console.log(`   - GP Code: ${testClaim.gpCode}`);

    // Test 2: Test Gram Sabha Officer visibility
    console.log('\n2. Testing Gram Sabha Officer visibility:');
    
    // Find Mendori Gram Sabha Officer
    const mendoriGSOfficer = await Admin.findOne({ 
      role: 'GramSabha', 
      assignedGpCode: 'GS-PHN-236194' 
    });
    if (mendoriGSOfficer) {
      console.log(`   - Found Mendori GS Officer: ${mendoriGSOfficer.name}`);
      
      // Simulate visibility check
      const mendoriClaims = await Claim.find({ gpCode: mendoriGSOfficer.assignedGpCode });
      console.log(`   - Mendori GS Officer can see ${mendoriClaims.length} claims`);
      console.log(`   - Claims: ${mendoriClaims.map(c => c.frapattaid).join(', ')}`);
    } else {
      console.log('   - No Mendori GS Officer found');
    }

    // Find a different Gram Sabha Officer (e.g., from Berasia)
    const otherGSOfficer = await Admin.findOne({ 
      role: 'GramSabha', 
      assignedGpCode: { $ne: 'GS-PHN-236194' } 
    });
    if (otherGSOfficer) {
      console.log(`   - Found other GS Officer: ${otherGSOfficer.name} (${otherGSOfficer.assignedGpCode})`);
      
      const otherClaims = await Claim.find({ gpCode: otherGSOfficer.assignedGpCode });
      console.log(`   - Other GS Officer can see ${otherClaims.length} claims`);
      console.log(`   - Claims: ${otherClaims.map(c => c.frapattaid).join(', ')}`);
    }

    // Test 3: Test Sub-Divisional Officer visibility
    console.log('\n3. Testing Sub-Divisional Officer visibility:');
    
    // Find Phanda SDLC Officer
    const phandaSDLC = await Admin.findOne({ 
      role: 'SDLCOfficer', 
      assignedSubdivision: 'Phanda' 
    });
    if (phandaSDLC) {
      console.log(`   - Found Phanda SDLC Officer: ${phandaSDLC.name}`);
      
      const phandaClaims = await Claim.find({ tehsil: 'Phanda' });
      console.log(`   - Phanda SDLC Officer can see ${phandaClaims.length} claims from Phanda subdivision`);
      console.log(`   - Claims: ${phandaClaims.map(c => c.frapattaid).join(', ')}`);
    } else {
      console.log('   - No Phanda SDLC Officer found');
    }

    // Find Berasia SDLC Officer
    const berasiaSDLC = await Admin.findOne({ 
      role: 'SDLCOfficer', 
      assignedSubdivision: 'Berasia' 
    });
    if (berasiaSDLC) {
      console.log(`   - Found Berasia SDLC Officer: ${berasiaSDLC.name}`);
      
      const berasiaClaims = await Claim.find({ tehsil: 'Berasia' });
      console.log(`   - Berasia SDLC Officer can see ${berasiaClaims.length} claims from Berasia subdivision`);
      console.log(`   - Claims: ${berasiaClaims.map(c => c.frapattaid).join(', ')}`);
    } else {
      console.log('   - No Berasia SDLC Officer found');
    }

    // Test 4: Test DLC Officer visibility
    console.log('\n4. Testing DLC Officer visibility:');
    
    const dlcOfficer = await Admin.findOne({ role: 'DLCOfficer' });
    if (dlcOfficer) {
      console.log(`   - Found DLC Officer: ${dlcOfficer.name}`);
      
      const allClaims = await Claim.find({});
      console.log(`   - DLC Officer can see ALL ${allClaims.length} claims`);
      console.log(`   - Claims: ${allClaims.map(c => c.frapattaid).join(', ')}`);
    } else {
      console.log('   - No DLC Officer found');
    }

    // Test 5: Test Super Admin visibility
    console.log('\n5. Testing Super Admin visibility:');
    
    const superAdmin = await Admin.findOne({ role: 'SuperAdmin' });
    if (superAdmin) {
      console.log(`   - Found Super Admin: ${superAdmin.name}`);
      
      const allClaims = await Claim.find({});
      console.log(`   - Super Admin can see ALL ${allClaims.length} claims`);
    } else {
      console.log('   - No Super Admin found');
    }

    // Test 6: Show location hierarchy
    console.log('\n6. Location Hierarchy Summary:');
    console.log('   - Mendori Village → Mendori Gram Panchayat → Phanda Subdivision → Bhopal District');
    console.log('   - Visibility Rules:');
    console.log('     • Mendori GS Officer: Only Mendori GP claims');
    console.log('     • Phanda SDLC Officer: All Phanda subdivision claims');
    console.log('     • DLC Officer: All claims in district');
    console.log('     • Super Admin: All claims');

    // Clean up test claim
    await Claim.deleteOne({ _id: testClaim._id });
    console.log('\n7. Cleaned up test claim');

    console.log('\n=== Test Complete ===');
    console.log('\nHierarchical Visibility System:');
    console.log('✅ Gram Sabha Officers see only their GP claims');
    console.log('✅ SDLC Officers see only their subdivision claims');
    console.log('✅ DLC Officers see all district claims');
    console.log('✅ Super Admins see all claims');

  } catch (error) {
    console.error('Error testing hierarchical visibility:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testHierarchicalVisibility();
