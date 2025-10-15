/* Create test claims for different Gram Sabhas to test filtering */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Claim = require('../model/claim.js');
const Claimant = require('../model/claimant.js');

async function createTestClaims() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== Creating Test Claims for Different Gram Sabhas ===\n');

    // Create test claimants first
    const claimants = [
      {
        name: 'Rajesh Kumar',
        aadhaarNumber: '123456789012',
        gender: 'Male',
        village: 'Mendori Village',
        gramPanchayat: 'MENDORI',
        tehsil: 'Phanda',
        district: 'Bhopal',
        state: 'Madhya Pradesh',
        tribeCategory: 'ST',
        password: 'password123'
      },
      {
        name: 'Sunita Devi',
        aadhaarNumber: '123456789013',
        gender: 'Female',
        village: 'Amarpur Village',
        gramPanchayat: 'AMARPUR',
        tehsil: 'Berasia',
        district: 'Bhopal',
        state: 'Madhya Pradesh',
        tribeCategory: 'ST',
        password: 'password123'
      },
      {
        name: 'Ramesh Patel',
        aadhaarNumber: '123456789014',
        gender: 'Male',
        village: 'Acharpura Village',
        gramPanchayat: 'ACHARPURA',
        tehsil: 'Phanda',
        district: 'Bhopal',
        state: 'Madhya Pradesh',
        tribeCategory: 'ST',
        password: 'password123'
      }
    ];

    const createdClaimants = [];
    for (const claimantData of claimants) {
      try {
        const claimant = new Claimant(claimantData);
        await claimant.save();
        createdClaimants.push(claimant);
        console.log(`✅ Created claimant: ${claimantData.name}`);
      } catch (error) {
        console.log(`⚠️ Claimant ${claimantData.name} might already exist: ${error.message}`);
        // Try to find existing claimant
        const existing = await Claimant.findOne({ aadhaarNumber: claimantData.aadhaarNumber });
        if (existing) {
          createdClaimants.push(existing);
        }
      }
    }

    // Create test claims for different Gram Sabhas
    const testClaims = [
      {
        claimant: createdClaimants[0]._id, // Rajesh Kumar
        claimType: 'Individual',
        forestLandArea: 2.5,
        frapattaid: 'FRP001',
        gpCode: 'GS-PHN-236194', // MENDORI
        gramPanchayat: 'MENDORI',
        tehsil: 'Phanda',
        district: 'Bhopal',
        applicantDetails: {
          claimantName: 'Rajesh Kumar',
          village: 'Mendori Village'
        },
        landDetails: {
          totalAreaClaimed: 2.5
        },
        status: 'Submitted'
      },
      {
        claimant: createdClaimants[1]._id, // Sunita Devi
        claimType: 'Individual',
        forestLandArea: 1.5,
        frapattaid: 'FRP002',
        gpCode: 'GS-BRS-134252', // AMARPUR
        gramPanchayat: 'AMARPUR',
        tehsil: 'Berasia',
        district: 'Bhopal',
        applicantDetails: {
          claimantName: 'Sunita Devi',
          village: 'Amarpur Village'
        },
        landDetails: {
          totalAreaClaimed: 1.5
        },
        status: 'Submitted'
      },
      {
        claimant: createdClaimants[2]._id, // Ramesh Patel
        claimType: 'Community',
        forestLandArea: 3.0,
        frapattaid: 'FRP003',
        gpCode: 'GS-PHN-134357', // ACHARPURA
        gramPanchayat: 'ACHARPURA',
        tehsil: 'Phanda',
        district: 'Bhopal',
        applicantDetails: {
          claimantName: 'Ramesh Patel',
          village: 'Acharpura Village'
        },
        landDetails: {
          totalAreaClaimed: 3.0
        },
        status: 'Submitted'
      }
    ];

    for (const claimData of testClaims) {
      try {
        const claim = new Claim(claimData);
        await claim.save();
        console.log(`✅ Created claim for ${claimData.gramPanchayat} (${claimData.gpCode})`);
      } catch (error) {
        console.log(`⚠️ Error creating claim for ${claimData.gramPanchayat}: ${error.message}`);
      }
    }

    console.log('\n=== Test Claims Created ===');
    console.log('Now you can test the GS claims filtering!');

  } catch (error) {
    console.error('Error creating test claims:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createTestClaims();
