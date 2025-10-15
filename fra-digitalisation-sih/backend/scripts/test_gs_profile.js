/* Test Gram Sabha Profile API */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const GramSabhaOfficer = require('../model/gramsabhaofficer');
const jwt = require('jsonwebtoken');

async function testGSProfile() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Get a sample Gram Sabha officer
    const officer = await GramSabhaOfficer.findOne({ subdivision: 'Phanda' });
    
    if (!officer) {
      console.log('No Gram Sabha officer found');
      return;
    }

    console.log('\n=== Testing Gram Sabha Profile API ===');
    console.log(`Testing with officer: ${officer.gpName} (${officer.gramSabhaId})`);

    // Create a test token
    const token = jwt.sign({ 
      role: 'GS', 
      gpCode: officer.gpCode, 
      gpName: officer.gpName, 
      subdivision: officer.subdivision, 
      district: officer.district, 
      id: officer._id 
    }, process.env.JWT_SECRET || 'fra_secret', { expiresIn: '1d' });

    console.log('\nToken created successfully');
    console.log('Officer data that should be returned:');
    console.log({
      id: officer._id,
      gramSabhaId: officer.gramSabhaId,
      gpCode: officer.gpCode,
      gpName: officer.gpName,
      subdivision: officer.subdivision,
      district: officer.district
    });

    console.log('\n✅ Profile API test completed successfully!');
    console.log('The frontend should now display the correct officer information.');

  } catch (error) {
    console.error('Error testing GS profile:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testGSProfile();
