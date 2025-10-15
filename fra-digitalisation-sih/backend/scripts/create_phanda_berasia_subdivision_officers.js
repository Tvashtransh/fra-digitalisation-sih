/* Create Phanda and Berasia Subdivision Officers */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const { Admin } = require('../model/admin.js');

async function createPhandaBerasiaOfficers() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== Creating Phanda & Berasia Subdivision Officers ===\n');

    // Remove existing block officer (BHO002)
    await Admin.deleteOne({ districtId: 'BHO002' });
    console.log('🗑️ Removed old Bhopal Block Officer (BHO002)');

    // Create Phanda Subdivision Officer
    const phandaOfficer = new Admin({
      name: 'Phanda Subdivision Officer',
      email: 'subdivision@phanda.gov.in',
      password: 'phandasubdivision123', // Will be auto-hashed
      contactNumber: '9876543220',
      role: 'block_officer', // Using block_officer role for subdivision functionality
      districtId: 'PHN001', // Phanda subdivision ID
      assignedDistrict: 'Bhopal',
      assignedSubdivision: 'Phanda',
      assignedGramPanchayat: 'Phanda',
      assignedGpCode: 'PHN-SUBDIVISION-001'
    });
    await phandaOfficer.save();
    console.log('✅ Created Phanda Subdivision Officer');
    console.log(`   ID: PHN001 | Password: phandasubdivision123`);
    console.log(`   Covers: 77 villages under Phanda subdivision`);

    // Create Berasia Subdivision Officer  
    const berasiaOfficer = new Admin({
      name: 'Berasia Subdivision Officer',
      email: 'subdivision@berasia.gov.in',
      password: 'berasiasubdivision123', // Will be auto-hashed
      contactNumber: '9876543221',
      role: 'block_officer', // Using block_officer role for subdivision functionality
      districtId: 'BRS001', // Berasia subdivision ID
      assignedDistrict: 'Bhopal',
      assignedSubdivision: 'Berasia',
      assignedGramPanchayat: 'Berasia',
      assignedGpCode: 'BRS-SUBDIVISION-001'
    });
    await berasiaOfficer.save();
    console.log('✅ Created Berasia Subdivision Officer');
    console.log(`   ID: BRS001 | Password: berasiasubdivision123`);
    console.log(`   Covers: 110 villages under Berasia subdivision`);

    console.log('\n=== Subdivision Officers Created ===');
    console.log('🏛️ Phanda Subdivision: PHN001 / phandasubdivision123');
    console.log('   - Handles claims from 77 Phanda villages');
    console.log('   - Villages with GP codes starting with GS-PHN-*');
    console.log('');
    console.log('🏛️ Berasia Subdivision: BRS001 / berasiasubdivision123');
    console.log('   - Handles claims from 110 Berasia villages');  
    console.log('   - Villages with GP codes starting with GS-BRS-*');
    console.log('');
    console.log('📋 FRONTEND UPDATE NEEDED:');
    console.log('Block Officer credentials should now be:');
    console.log('• Phanda: PHN001 / phandasubdivision123');
    console.log('• Berasia: BRS001 / berasiasubdivision123');

  } catch (error) {
    console.error('Error creating subdivision officers:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createPhandaBerasiaOfficers();
