/* Clean up and Create Phanda & Berasia Subdivision Officers */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const { Admin } = require('../model/admin.js');

async function cleanupAndCreateSubdivisionOfficers() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== Cleaning Up Existing Officers ===\n');

    // Remove all existing subdivision/block officers
    const deleteResult = await Admin.deleteMany({
      $or: [
        { role: 'block_officer' },
        { role: 'SDLCOfficer' },
        { email: { $in: ['subdivision@phanda.gov.in', 'subdivision@berasia.gov.in', 'block@bhopal.gov.in'] } },
        { districtId: { $in: ['BHO002', 'PHN001', 'BRS001'] } },
        { subdivisionId: { $in: ['PHN001', 'BRS001'] } }
      ]
    });
    console.log(`🗑️ Removed ${deleteResult.deletedCount} existing officers`);

    console.log('\n=== Creating New Subdivision Officers ===\n');

    // Create Phanda Subdivision Officer (for block officer dashboard)
    const phandaOfficer = new Admin({
      name: 'Phanda Subdivision Officer',
      email: 'phanda@subdivision.gov.in', // Changed email to avoid duplicates
      password: 'phandasubdivision123',
      contactNumber: '9876543220',
      role: 'block_officer', // Using block_officer role for the dashboard
      districtId: 'PHN001', // This is what the login system uses
      assignedDistrict: 'Bhopal',
      assignedSubdivision: 'Phanda',
      assignedGramPanchayat: 'Phanda',
      assignedGpCode: 'PHN-SUBDIVISION-001'
    });
    await phandaOfficer.save();
    console.log('✅ Created Phanda Subdivision Officer');

    // Create Berasia Subdivision Officer (for block officer dashboard)
    const berasiaOfficer = new Admin({
      name: 'Berasia Subdivision Officer', 
      email: 'berasia@subdivision.gov.in', // Changed email to avoid duplicates
      password: 'berasiasubdivision123',
      contactNumber: '9876543221',
      role: 'block_officer', // Using block_officer role for the dashboard
      districtId: 'BRS001', // This is what the login system uses
      assignedDistrict: 'Bhopal',
      assignedSubdivision: 'Berasia',
      assignedGramPanchayat: 'Berasia', 
      assignedGpCode: 'BRS-SUBDIVISION-001'
    });
    await berasiaOfficer.save();
    console.log('✅ Created Berasia Subdivision Officer');

    console.log('\n=== SUBDIVISION OFFICERS READY ===');
    console.log('');
    console.log('🏛️ PHANDA SUBDIVISION OFFICER:');
    console.log('   Login ID: PHN001');
    console.log('   Password: phandasubdivision123');
    console.log('   Handles: Claims from 77 Phanda villages (GP codes: GS-PHN-*)');
    console.log('');
    console.log('🏛️ BERASIA SUBDIVISION OFFICER:');
    console.log('   Login ID: BRS001');
    console.log('   Password: berasiasubdivision123');
    console.log('   Handles: Claims from 110 Berasia villages (GP codes: GS-BRS-*)');
    console.log('');
    console.log('📋 NEXT STEPS:');
    console.log('1. Update frontend credentials');
    console.log('2. Update claim filtering logic');
    console.log('3. Test subdivision-specific claim visibility');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

cleanupAndCreateSubdivisionOfficers();
