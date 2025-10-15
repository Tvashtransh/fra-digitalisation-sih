/* Test Claimant Status Tracker Issue */
console.log('🔍 Testing Claimant Status Tracker Issue...\n');

const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

async function testClaimantStatusTracker() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');

    // Import models
    const Claimant = require('../model/claimant.js');
    const Claim = require('../model/claim.js');

    // 1. Check if we have any claimants
    const claimants = await Claimant.find({}).limit(5);
    console.log(`\n📊 Found ${claimants.length} claimants in database:`);
    claimants.forEach(c => {
      console.log(`   - ${c.name} (${c.email}) - ID: ${c._id}`);
    });

    if (claimants.length === 0) {
      console.log('\n❌ No claimants found in database! Creating a test claimant...');
      
      const testClaimant = new Claimant({
        name: 'Test User',
        email: 'test@example.com',
        password: '$2b$12$hashedPassword', // bcrypt hash
        phone: '9876543210',
        aadhaarNumber: '123456789012',
        village: 'Test Village',
        gramPanchayat: 'Test GP',
        tehsil: 'Phanda',
        district: 'Bhopal'
      });
      
      await testClaimant.save();
      console.log('✅ Test claimant created');
      claimants.push(testClaimant);
    }

    // 2. Check claims for the first claimant
    const firstClaimant = claimants[0];
    const claims = await Claim.find({ claimant: firstClaimant._id }).sort({ createdAt: -1 });
    
    console.log(`\n📋 Claims for ${firstClaimant.name}:`);
    console.log(`   Found ${claims.length} claims`);
    
    claims.forEach(claim => {
      console.log(`   - ${claim.frapattaid}: ${claim.status}`);
      console.log(`     Created: ${claim.createdAt}`);
      console.log(`     Updated: ${claim.updatedAt}`);
      console.log(`     Land Area: ${claim.forestLandArea} hectares`);
    });

    if (claims.length === 0) {
      console.log('\n❌ No claims found for claimant! Creating a test claim...');
      
      const testClaim = new Claim({
        claimant: firstClaimant._id,
        claimType: 'Individual',
        forestLandArea: 2.5,
        frapattaid: 'FRA-2025-TEST-001',
        gramPanchayat: 'Amla',
        tehsil: 'Phanda',
        district: 'Bhopal',
        gpCode: 'GS-PHN-134123',
        status: 'Submitted',
        applicantDetails: {
          claimantName: firstClaimant.name,
          village: firstClaimant.village
        },
        landDetails: {
          totalAreaClaimed: 2.5
        }
      });
      
      await testClaim.save();
      console.log('✅ Test claim created');
      claims.push(testClaim);
    }

    // 3. Test API response format
    console.log('\n🔍 Testing API response format:');
    const sampleClaim = claims[0];
    const apiResponse = {
      success: true,
      claims: claims
    };
    
    console.log('✅ Sample API Response:');
    console.log(JSON.stringify(apiResponse, null, 2));

    // 4. Check status mapping
    console.log('\n📊 Status Analysis:');
    const statusCounts = {};
    claims.forEach(claim => {
      statusCounts[claim.status] = (statusCounts[claim.status] || 0) + 1;
    });
    
    console.log('Status distribution:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   ${status}: ${count} claims`);
    });

    // 5. Frontend Status Steps Mapping
    console.log('\n🎯 Frontend Status Steps Mapping:');
    const frontendSteps = [
      { id: 1, name: 'Application', status: 'Submitted' },
      { id: 2, name: 'Gram Sabha', status: 'MappedByGramSabha' },
      { id: 3, name: 'Subdivision Review', status: 'forwarded_to_district' },
      { id: 4, name: 'District Review', status: 'UnderDistrictReview' },
      { id: 5, name: 'Title Granted', status: 'Title Granted' }
    ];

    claims.forEach(claim => {
      const matchingStep = frontendSteps.find(step => step.status === claim.status);
      console.log(`   Claim ${claim.frapattaid}:`);
      console.log(`     Backend Status: "${claim.status}"`);
      console.log(`     Frontend Step: ${matchingStep ? `"${matchingStep.name}"` : 'NOT MAPPED'}`);
      
      if (!matchingStep) {
        console.log(`     ⚠️  STATUS NOT MAPPED IN FRONTEND!`);
      }
    });

    console.log('\n🎉 Claimant Status Tracker Test Complete!');
    
  } catch (error) {
    console.error('❌ Error in test:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the test
if (require.main === module) {
  testClaimantStatusTracker();
}

module.exports = testClaimantStatusTracker;
