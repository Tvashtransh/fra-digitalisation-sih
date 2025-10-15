/* Create Subdivision Officers for Phanda and Berasia */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const { Admin } = require('../model/admin.js');

async function createSubdivisionOfficers() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== Creating Subdivision Officers ===\n');

    // Create Phanda Subdivision Officer
    const phandaOfficer = new Admin({
      name: 'Phanda Subdivision Officer',
      email: 'subdivision@phanda.gov.in',
      password: 'phandasubdivision123', // Plain text - will be auto-hashed
      contactNumber: '9876543220',
      role: 'SDLCOfficer',
      subdivisionId: 'PHN001', // Add this field for login
      assignedDistrict: 'Bhopal',
      assignedSubdivision: 'Phanda',
      assignedGramPanchayat: 'Phanda',
      assignedGpCode: 'PHN-SUBDIVISION-001'
    });
    await phandaOfficer.save();
    console.log('✅ Created Phanda Subdivision Officer');

    // Create Berasia Subdivision Officer
    const berasiaOfficer = new Admin({
      name: 'Berasia Subdivision Officer',
      email: 'subdivision@berasia.gov.in',
      password: 'berasiasubdivision123', // Plain text - will be auto-hashed
      contactNumber: '9876543221',
      role: 'SDLCOfficer',
      subdivisionId: 'BRS001', // Add this field for login
      assignedDistrict: 'Bhopal',
      assignedSubdivision: 'Berasia',
      assignedGramPanchayat: 'Berasia',
      assignedGpCode: 'BRS-SUBDIVISION-001'
    });
    await berasiaOfficer.save();
    console.log('✅ Created Berasia Subdivision Officer');

    console.log('\n=== Subdivision Officers Created ===');
    console.log('Phanda Subdivision: PHN001 / phandasubdivision123');
    console.log('Berasia Subdivision: BRS001 / berasiasubdivision123');
    console.log('Email: subdivision@phanda.gov.in / subdivision@berasia.gov.in');

  } catch (error) {
    console.error('Error creating subdivision officers:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createSubdivisionOfficers();
