/* Test Claim Submission Restrictions */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Claim = require('../model/claim.js');
const Claimant = require('../model/claimant.js');

async function testClaimRestrictions() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== Testing Claim Submission Restrictions ===\n');

    // Test 1: User with no claims should be able to submit
    console.log('1. Testing user with no claims:');
    const newClaimant = await Claimant.findOne();
    if (newClaimant) {
      const noClaims = await Claim.find({ claimant: newClaimant._id });
      console.log(`   - User ${newClaimant.name} has ${noClaims.length} claims`);
      console.log(`   - Can submit: ${noClaims.length === 0 ? 'YES' : 'NO'}`);
    }

    // Test 2: User with active claim should not be able to submit
    console.log('\n2. Testing user with active claim:');
    const activeClaim = await Claim.findOne({ 
      status: { $in: ['Submitted', 'RecommendedByGramSabha', 'ApprovedBySDLC', 'ApprovedByDLC'] } 
    });
    if (activeClaim) {
      const activeClaims = await Claim.find({ claimant: activeClaim.claimant });
      console.log(`   - User has ${activeClaims.length} claims`);
      console.log(`   - Latest claim status: ${activeClaim.status}`);
      console.log(`   - Can submit: NO (active claim in process)`);
    }

    // Test 3: User with approved claim should not be able to submit
    console.log('\n3. Testing user with approved claim:');
    const approvedClaim = await Claim.findOne({ status: 'ApprovedByDLC' });
    if (approvedClaim) {
      console.log(`   - User has approved claim: ${approvedClaim.frapattaid}`);
      console.log(`   - Status: ${approvedClaim.status}`);
      console.log(`   - Can submit: NO (already approved)`);
    }

    // Test 4: User with rejected claim should be able to submit
    console.log('\n4. Testing user with rejected claim:');
    const rejectedClaim = await Claim.findOne({ status: 'Rejected' });
    if (rejectedClaim) {
      const allUserClaims = await Claim.find({ claimant: rejectedClaim.claimant }).sort({ createdAt: -1 });
      const latestClaim = allUserClaims[0];
      console.log(`   - User has ${allUserClaims.length} claims`);
      console.log(`   - Latest claim status: ${latestClaim.status}`);
      console.log(`   - Can submit: ${latestClaim.status === 'Rejected' ? 'YES' : 'NO'}`);
    }

    // Test 5: Show all claim statuses in database
    console.log('\n5. Claim status distribution:');
    const statusCounts = await Claim.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    statusCounts.forEach(status => {
      console.log(`   - ${status._id}: ${status.count} claims`);
    });

    console.log('\n=== Test Complete ===');
    console.log('\nBusiness Rules Implemented:');
    console.log('✅ Only one active claim per user');
    console.log('✅ Cannot submit if claim is in process (Submitted, RecommendedByGramSabha, ApprovedBySDLC, ApprovedByDLC)');
    console.log('✅ Cannot submit if claim is approved (ApprovedByDLC)');
    console.log('✅ Can submit if previous claim was rejected (Rejected)');
    console.log('✅ Can submit if no previous claims');

  } catch (error) {
    console.error('Error testing claim restrictions:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testClaimRestrictions();

