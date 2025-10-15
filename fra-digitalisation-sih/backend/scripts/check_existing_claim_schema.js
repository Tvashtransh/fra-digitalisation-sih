/* Check Existing Claim Schema */
const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

async function checkExistingClaimSchema() {
  try {
    console.log('Checking Existing Claim Schema...');
    console.log('================================');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');
    
    // Get the existing claim collection
    const db = mongoose.connection.db;
    const claimCollection = db.collection('claims');
    
    // Get one existing claim to see its structure
    const existingClaim = await claimCollection.findOne({});
    
    if (existingClaim) {
      console.log('\n1. Existing Claim Structure:');
      console.log('Claim ID:', existingClaim._id);
      console.log('FRA ID:', existingClaim.frapattaid);
      console.log('Has mapData:', !!existingClaim.mapData);
      
      if (existingClaim.mapData) {
        console.log('MapData structure:');
        console.log('  - areas type:', typeof existingClaim.mapData.areas);
        console.log('  - areas is array:', Array.isArray(existingClaim.mapData.areas));
        console.log('  - areas length:', existingClaim.mapData.areas ? existingClaim.mapData.areas.length : 0);
        
        if (existingClaim.mapData.areas && existingClaim.mapData.areas.length > 0) {
          console.log('  - First area type:', typeof existingClaim.mapData.areas[0]);
          console.log('  - First area value:', existingClaim.mapData.areas[0]);
        }
        
        console.log('MapData complete structure:');
        console.log(JSON.stringify(existingClaim.mapData, null, 2));
      } else {
        console.log('No mapData in existing claim');
      }
    } else {
      console.log('No claims found in database');
    }
    
    // Check the collection schema
    console.log('\n2. Collection Info:');
    const stats = await db.collection('claims').stats();
    console.log('Collection name:', stats.collection);
    console.log('Document count:', stats.count);
    
  } catch (error) {
    console.error('Error checking schema:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

checkExistingClaimSchema();
