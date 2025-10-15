/* Create Test Claim for Mapping */
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
      area: Number,
      type: String,
      geojson: Object
    }],
    totalArea: Number,
    createdAt: Date,
    updatedAt: Date
  },
  applicantDetails: {
    claimantName: { type: String, required: true },
    spouseName: String,
    fatherOrMotherName: String,
    address: String,
    village: String,
    familyMembers: [{
      name: String,
      age: Number,
      relation: String
    }]
  },
  eligibilityStatus: {
    isST: { type: Boolean, default: false },
    isOTFD: { type: Boolean, default: false },
    isSpouseST: { type: Boolean, default: false },
    otfdJustification: String
  },
  landDetails: {
    extentHabitation: { type: Number, default: 0 },
    extentSelfCultivation: { type: Number, default: 0 },
    totalAreaClaimed: { type: Number, required: true },
    compartmentNumber: String,
    landDescription: String
  },
  claimBasis: {
    hasDisputes: { type: Boolean, default: false },
    disputeDescription: String,
    hasOldTitles: { type: Boolean, default: false },
    oldTitlesDescription: String,
    wasDisplaced: { type: Boolean, default: false },
    displacementDescription: String,
    isForestVillage: { type: Boolean, default: false },
    forestVillageDescription: String,
    hasOtherRights: { type: Boolean, default: false },
    otherRightsDescription: String
  },
  evidence: {
    governmentDocuments: [{
      docType: String,
      details: String,
      fileUrl: String,
      uploadedAt: { type: Date, default: Date.now }
    }],
    elderTestimonies: [{
      elderName: String,
      testimonyDetails: String,
      fileUrl: String,
      uploadedAt: { type: Date, default: Date.now }
    }],
    physicalProof: [{
      description: String,
      fileUrls: [String],
      uploadedAt: { type: Date, default: Date.now }
    }],
    oldGovernmentRecords: [{
      recordDescription: String,
      fileUrl: String,
      uploadedAt: { type: Date, default: Date.now }
    }]
  },
  declaration: {
    isInformationTrue: { type: Boolean, default: false },
    signatureFile: String,
    applicationDate: { type: Date, default: Date.now }
  },
  rightsRequested: [
    {
      type: String,
      enum: [
        "Habitation",
        "Cultivation",
        "MinorForestProduce",
        "Grazing",
        "HabitatRights",
        "CommunityForestManagement"
      ]
    }
  ],
  documents: [
    {
      docType: String,
      fileUrl: String,
      uploadedAt: { type: Date, default: Date.now }
    }
  ],
  gramSabhaResolution: {
    passed: { type: Boolean, default: false },
    date: Date,
    resolutionFile: String
  },
  status: {
    type: String,
    enum: [
      "Submitted",
      "MappedByGramSabha",
      "ForwardedToSubdivision",
      "UnderSubdivisionReview",
      "ApprovedBySubdivision",
      "RejectedBySubdivision",
      "ForwardedToDistrict",
      "UnderDistrictReview",
      "ApprovedByDistrict",
      "RejectedByDistrict",
      "FinalApproved",
      "FinalRejected"
    ],
    default: "Submitted"
  },
  workflow: {
    gsOfficer: {
      officerId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
      action: { type: String, enum: ["mapped", "forwarded"] },
      actionDate: Date,
      remarks: String
    },
    subdivisionOfficer: {
      officerId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
      action: { type: String, enum: ["reviewed", "approved", "rejected", "forwarded"] },
      actionDate: Date,
      remarks: String
    },
    districtOfficer: {
      officerId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
      action: { type: String, enum: ["reviewed", "approved", "rejected"] },
      actionDate: Date,
      remarks: String
    }
  },
  remarks: String,
  createdAt: { type: Date, default: Date.now }
});

const Claim = mongoose.model("Claim", ClaimSchema);

async function createTestClaim() {
  try {
    console.log('Creating test claim for mapping...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');
    
    // Create a test claim for AMLA village (GS-PHN-134363)
    const testClaim = new Claim({
      claimant: new mongoose.Types.ObjectId(), // Dummy claimant ID
      claimType: "Individual",
      forestLandArea: 1.5,
      landCoordinates: [
        { lat: 23.2599, lng: 77.4126 },
        { lat: 23.2609, lng: 77.4136 }
      ],
      frapattaid: "FRA-2025-TEST-MAP",
      gramPanchayat: "AMLA",
      tehsil: "Phanda",
      district: "Bhopal",
      gpCode: "GS-PHN-134363",
      applicantDetails: {
        claimantName: "Test User for Mapping",
        spouseName: "Test Spouse",
        fatherOrMotherName: "Test Father",
        address: "Test Address, AMLA Village",
        village: "AMLA"
      },
      eligibilityStatus: {
        isST: true,
        isOTFD: false,
        isSpouseST: false
      },
      landDetails: {
        extentHabitation: 0.5,
        extentSelfCultivation: 1.0,
        totalAreaClaimed: 1.5,
        compartmentNumber: "TEST-001",
        landDescription: "Test land for mapping functionality"
      },
      claimBasis: {
        hasDisputes: false,
        hasOldTitles: false,
        wasDisplaced: false,
        isForestVillage: true,
        hasOtherRights: false
      },
      declaration: {
        isInformationTrue: true,
        applicationDate: new Date()
      },
      rightsRequested: ["Habitation", "Cultivation"],
      status: "Submitted",
      workflow: {
        gsOfficer: {},
        subdivisionOfficer: {},
        districtOfficer: {}
      }
    });
    
    await testClaim.save();
    console.log('✅ Test claim created successfully!');
    console.log('Claim ID:', testClaim._id);
    console.log('FRA ID:', testClaim.frapattaid);
    console.log('GP Code:', testClaim.gpCode);
    console.log('Status:', testClaim.status);
    
  } catch (error) {
    console.error('Error creating test claim:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createTestClaim();
