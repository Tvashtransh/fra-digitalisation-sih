/* Debug Claims and Officer GP Codes */
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
  status: { type: String, default: "Submitted" },
  workflow: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
});

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'GramSabha', 'Subdivision', 'District'], required: true },
  assignedGpCode: { type: String },
  assignedGramPanchayat: { type: String },
  assignedSubdivision: { type: String },
  assignedDistrict: { type: String },
  assignedVillage: { type: String },
  contactNumber: { type: String }
});

const Claim = mongoose.model("Claim", ClaimSchema);
const Admin = mongoose.model("Admin", AdminSchema);

async function debugClaimsAndOfficer() {
  try {
    console.log('Debugging Claims and Officer GP Codes...');
    console.log('==========================================');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');
    
    // Find the AMLA GS officer
    const officer = await Admin.findOne({ 
      role: 'GramSabha',
      assignedGpCode: 'GS-PHN-134363'
    });
    
    console.log('\n1. GS Officer Details:');
    if (officer) {
      console.log('   Officer ID:', officer._id);
      console.log('   Name:', officer.name);
      console.log('   Email:', officer.email);
      console.log('   GP Code:', officer.assignedGpCode);
      console.log('   GP Name:', officer.assignedGramPanchayat);
    } else {
      console.log('   Officer not found!');
    }
    
    // Find all claims
    const allClaims = await Claim.find({});
    console.log('\n2. All Claims in Database:');
    console.log('   Total claims:', allClaims.length);
    
    allClaims.forEach((claim, index) => {
      console.log(`   Claim ${index + 1}:`);
      console.log(`     ID: ${claim._id}`);
      console.log(`     FRA ID: ${claim.frapattaid}`);
      console.log(`     GP Code: ${claim.gpCode}`);
      console.log(`     Status: ${claim.status}`);
      console.log(`     Gram Panchayat: ${claim.gramPanchayat}`);
    });
    
    // Find claims for AMLA officer specifically
    const amlaClaims = await Claim.find({ gpCode: 'GS-PHN-134363' });
    console.log('\n3. Claims for AMLA Officer (GS-PHN-134363):');
    console.log('   Count:', amlaClaims.length);
    
    amlaClaims.forEach((claim, index) => {
      console.log(`   Claim ${index + 1}:`);
      console.log(`     ID: ${claim._id}`);
      console.log(`     FRA ID: ${claim.frapattaid}`);
      console.log(`     Status: ${claim.status}`);
    });
    
    // Check if there are any claims with different GP code formats
    const testClaims = await Claim.find({ frapattaid: 'FRA-2025-TEST-MAP' });
    console.log('\n4. Test Claim Details:');
    testClaims.forEach((claim, index) => {
      console.log(`   Test Claim ${index + 1}:`);
      console.log(`     ID: ${claim._id}`);
      console.log(`     FRA ID: ${claim.frapattaid}`);
      console.log(`     GP Code: ${claim.gpCode}`);
      console.log(`     Status: ${claim.status}`);
    });
    
  } catch (error) {
    console.error('Debug error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

debugClaimsAndOfficer();
