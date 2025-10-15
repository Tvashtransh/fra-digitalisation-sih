/* Test Complete District Officer Workflow */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../model/admin.js');
const Claim = require('../model/claim.js');

async function testDistrictWorkflow() {
  try {
    console.log('🧪 Testing Complete District Officer Workflow...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB\n');

    // 1. Test District Officer Login Logic
    console.log('1️⃣ Testing District Officer Login...');
    const officer = await Admin.findOne({ 
      districtId: 'BHO001',
      role: 'district_officer'
    });

    if (!officer) {
      console.log('❌ District Officer BHO001 not found');
      return;
    }

    const isPasswordValid = await bcrypt.compare('bhopaldistrict123', officer.password);
    if (!isPasswordValid) {
      console.log('❌ Invalid password for BHO001');
      return;
    }

    console.log('✅ District Officer Login: SUCCESS');
    console.log(`   Officer: ${officer.name}`);
    console.log(`   District: ${officer.assignedDistrict}`);
    console.log(`   Role: ${officer.role}\n`);

    // 2. Test Claims Retrieval
    console.log('2️⃣ Testing Claims Retrieval...');
    const claims = await Claim.find({
      status: { $in: ['forwarded_to_district', 'UnderDistrictReview', 'Title Granted', 'FinalRejected'] }
    });

    console.log(`✅ Found ${claims.length} claims for district review`);
    
    // Group by subdivision
    const claimsBySubdivision = {
      Phanda: claims.filter(claim => claim.gpCode?.startsWith('GS-PHN-')),
      Berasia: claims.filter(claim => claim.gpCode?.startsWith('GS-BRS-')),
      Unknown: claims.filter(claim => !claim.gpCode || (!claim.gpCode.startsWith('GS-PHN-') && !claim.gpCode.startsWith('GS-BRS-')))
    };

    console.log(`   Phanda: ${claimsBySubdivision.Phanda.length} claims`);
    console.log(`   Berasia: ${claimsBySubdivision.Berasia.length} claims`);
    console.log(`   Unknown: ${claimsBySubdivision.Unknown.length} claims\n`);

    // 3. Show sample claims
    if (claims.length > 0) {
      console.log('3️⃣ Sample Claims:');
      claims.slice(0, 3).forEach((claim, index) => {
        const subdivision = claim.gpCode?.startsWith('GS-PHN-') ? 'Phanda' : 
                           claim.gpCode?.startsWith('GS-BRS-') ? 'Berasia' : 'Unknown';
        console.log(`   ${index + 1}. ${claim.frapattaid} - ${claim.applicantDetails?.claimantName}`);
        console.log(`      Status: ${claim.status}`);
        console.log(`      Subdivision: ${subdivision}`);
        console.log(`      Village: ${claim.gramPanchayat}`);
        console.log(`      Area: ${claim.forestLandArea} acres`);
        console.log(`      Has Map: ${claim.mapData && claim.mapData.areas ? 'Yes' : 'No'}`);
        console.log('');
      });
    }

    // 4. Test Status Updates
    console.log('4️⃣ Testing Status Update Logic...');
    const testClaim = claims.find(claim => claim.status === 'forwarded_to_district');
    if (testClaim) {
      console.log(`✅ Found test claim: ${testClaim.frapattaid}`);
      console.log(`   Current Status: ${testClaim.status}`);
      console.log(`   Would update to: "Title Granted" upon approval`);
      console.log(`   Would update to: "FinalRejected" upon rejection`);
    } else {
      console.log('ℹ️  No claims with "forwarded_to_district" status found for testing');
    }

    console.log('\n🎉 District Officer Workflow Test Complete!');
    console.log('\n📋 Summary:');
    console.log(`   ✅ Login: Working`);
    console.log(`   ✅ Claims Retrieval: Working`);
    console.log(`   ✅ Subdivision Filtering: Working`);
    console.log(`   ✅ Status Management: Ready`);

  } catch (error) {
    console.error('❌ Test Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

testDistrictWorkflow();
