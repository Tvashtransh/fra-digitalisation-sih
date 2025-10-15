/* Test Claim Visibility Based on Location */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Claim = require('../model/claim.js');
const Admin = require('../model/admin.js');

async function testClaimVisibility() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Test data - create sample claims for different locations
    const sampleClaims = [
      {
        frapattaid: 'FRA-2025-001',
        claimType: 'Individual',
        forestLandArea: 0.5,
        gpCode: 'GS-PHN-001', // Mendori Gram Panchayat
        applicantDetails: {
          tehsil: 'Phanda',
          gramPanchayat: 'Mendori',
          district: 'Bhopal'
        },
        status: 'Submitted'
      },
      {
        frapattaid: 'FRA-2025-002',
        claimType: 'Individual',
        forestLandArea: 0.3,
        gpCode: 'GS-BRS-001', // Berasia Gram Panchayat
        applicantDetails: {
          tehsil: 'Berasia',
          gramPanchayat: 'Berasia',
          district: 'Bhopal'
        },
        status: 'Submitted'
      }
    ];

    console.log('\n=== Testing Claim Visibility ===\n');

    // Test 1: Gram Sabha Officer from Mendori should only see Mendori claims
    console.log('1. Testing Gram Sabha Officer (Mendori):');
    const mendoriGS = await Admin.findOne({ 
      role: 'GramSabha', 
      assignedGpCode: 'GS-PHN-001' 
    });
    
    if (mendoriGS) {
      const mendoriClaims = await Claim.find({ gpCode: 'GS-PHN-001' });
      console.log(`   - Mendori GS Officer can see ${mendoriClaims.length} claims`);
      mendoriClaims.forEach(claim => {
        console.log(`     * ${claim.frapattaid} - ${claim.applicantDetails?.gramPanchayat}`);
      });
    } else {
      console.log('   - No Mendori GS Officer found');
    }

    // Test 2: SDLC Officer from Phanda should see all Phanda claims
    console.log('\n2. Testing SDLC Officer (Phanda):');
    const phandaSDLC = await Admin.findOne({ 
      role: 'SDLCOfficer', 
      assignedSubdivision: 'Phanda' 
    });
    
    if (phandaSDLC) {
      const phandaClaims = await Claim.find({ 'applicantDetails.tehsil': 'Phanda' });
      console.log(`   - Phanda SDLC Officer can see ${phandaClaims.length} claims`);
      phandaClaims.forEach(claim => {
        console.log(`     * ${claim.frapattaid} - ${claim.applicantDetails?.gramPanchayat} (${claim.applicantDetails?.tehsil})`);
      });
    } else {
      console.log('   - No Phanda SDLC Officer found');
    }

    // Test 3: DLC Officer should see all claims
    console.log('\n3. Testing DLC Officer:');
    const dlcOfficer = await Admin.findOne({ role: 'DLCOfficer' });
    
    if (dlcOfficer) {
      const allClaims = await Claim.find({});
      console.log(`   - DLC Officer can see ${allClaims.length} claims`);
      allClaims.forEach(claim => {
        console.log(`     * ${claim.frapattaid} - ${claim.applicantDetails?.gramPanchayat} (${claim.applicantDetails?.tehsil})`);
      });
    } else {
      console.log('   - No DLC Officer found');
    }

    // Test 4: Super Admin should see all claims
    console.log('\n4. Testing Super Admin:');
    const superAdmin = await Admin.findOne({ role: 'SuperAdmin' });
    
    if (superAdmin) {
      const allClaims = await Claim.find({});
      console.log(`   - Super Admin can see ${allClaims.length} claims`);
      allClaims.forEach(claim => {
        console.log(`     * ${claim.frapattaid} - ${claim.applicantDetails?.gramPanchayat} (${claim.applicantDetails?.tehsil})`);
      });
    } else {
      console.log('   - No Super Admin found');
    }

    console.log('\n=== Test Complete ===');

  } catch (error) {
    console.error('Error testing claim visibility:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testClaimVisibility();
