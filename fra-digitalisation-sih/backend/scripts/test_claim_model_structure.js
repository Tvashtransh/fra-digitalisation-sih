/* Test Claim Model Structure */
const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

const ClaimSchema = new mongoose.Schema({
  claimant: { type: mongoose.Schema.Types.ObjectId, ref: "Claimant", required: true },
  claimType: { type: String, enum: ["Individual", "Community"], required: true },
  forestLandArea: { type: Number, required: true },
  landCoordinates: [{ lat: Number, lng: Number }],
  frapattaid: { type: String, unique: true },
  gramPanchayat: { type: String },
  tehsil: { type: String },
  district: { type: String },
  gpCode: { type: String, index: true },
  mapData: {
    areas: [{
      id: String,
      area: Number, // in square meters
      type: String, // polygon, rectangle, circle
      geojson: Object // GeoJSON geometry
    }],
    totalArea: Number, // total area in square meters
    createdAt: Date,
    updatedAt: Date
  },
  status: { type: String, default: "Submitted" },
  workflow: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
});

const Claim = mongoose.model("Claim", ClaimSchema);

async function testClaimModelStructure() {
  try {
    console.log('Testing Claim Model Structure...');
    console.log('================================');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');
    
    // Create a test claim with mapData
    const testMapData = {
      areas: [{
        id: 'test-area-1',
        area: 1000,
        type: 'polygon',
        geojson: {
          type: 'Polygon',
          coordinates: [[[77.4, 23.2], [77.5, 23.2], [77.5, 23.3], [77.4, 23.3], [77.4, 23.2]]]
        }
      }],
      totalArea: 1000
    };
    
    console.log('\n1. Test Map Data:');
    console.log(JSON.stringify(testMapData, null, 2));
    
    // Try to create a claim with this mapData
    const testClaim = new Claim({
      claimant: new mongoose.Types.ObjectId(),
      claimType: "Individual",
      forestLandArea: 1.5,
      frapattaid: "FRA-2025-MODEL-TEST",
      gramPanchayat: "TEST",
      tehsil: "TEST",
      district: "TEST",
      gpCode: "GS-TEST-001",
      mapData: testMapData,
      status: "Submitted",
      workflow: {
        gsOfficer: {},
        subdivisionOfficer: {},
        districtOfficer: {}
      }
    });
    
    console.log('\n2. Attempting to save claim with mapData...');
    await testClaim.save();
    console.log('✅ Claim saved successfully!');
    console.log('Claim ID:', testClaim._id);
    console.log('MapData areas count:', testClaim.mapData.areas.length);
    console.log('First area:', testClaim.mapData.areas[0]);
    
    // Clean up
    await Claim.deleteOne({ _id: testClaim._id });
    console.log('\n3. Test claim cleaned up');
    
  } catch (error) {
    console.error('❌ Error testing claim model:', error.message);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

testClaimModelStructure();
