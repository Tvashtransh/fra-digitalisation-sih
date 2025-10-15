const mongoose = require('mongoose');
const ClaimSchema = new mongoose.Schema({
  claimant: { type: mongoose.Schema.Types.ObjectId, ref: "Claimant", required: true },
  claimType: { type: String, enum: ["Individual", "Community"], required: true },
  forestLandArea: { type: Number, required: true }, // in hectares
  landCoordinates: [{ lat: Number, lng: Number }], // geo points
  frapattaid:{type:String,unique:true},
  
  // Location scoping for GS dashboards
  gramPanchayat: { type: String },
  tehsil: { type: String },
  district: { type: String },
  gpCode: { type: String, index: true },
  
  // Map data for land area visualization
  mapData: {
    areasJson: String, // JSON string of areas array to avoid schema conflicts
    totalArea: Number, // total area in square meters
    createdAt: Date,
    updatedAt: Date
  },
  
  // GeoJSON geometry for the claimed land
  geometry: {
    type: {
      type: String,
      enum: ['Polygon', 'MultiPolygon'],
      default: 'Polygon'
    },
    coordinates: {
      type: mongoose.Schema.Types.Mixed,
      required: false
    }
  },
  
  // Section A: Applicant Details
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
  
  // Section B: Eligibility Status
  eligibilityStatus: {
    isST: { type: Boolean, default: false },
    isOTFD: { type: Boolean, default: false },
    isSpouseST: { type: Boolean, default: false },
    otfdJustification: String // Required if isOTFD is true
  },
  
  // Section C: Details of Forest Land Being Claimed
  landDetails: {
    extentHabitation: { type: Number, default: 0 }, // in hectares
    extentSelfCultivation: { type: Number, default: 0 }, // in hectares
    totalAreaClaimed: { type: Number, required: true }, // auto-calculated
    compartmentNumber: String, // Forest compartment no. / Khasra no.
    landDescription: String // Description of land boundaries
  },
  
  // Section D: Nature and Basis of Claim (Optional Sections)
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
  
  // Section E: Evidence in Support of Claim
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
  
  // Section F: Declaration and Submission
  declaration: {
    isInformationTrue: { type: Boolean, default: false },
    signatureFile: String, // Thumb impression or signature
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
      fileUrl: String, // path to uploaded file
      uploadedAt: { type: Date, default: Date.now }
    }
  ],
  gramSabhaResolution: {
  passed: { type: Boolean, default: false },
  date: Date,
  resolutionFile: String, // PDF or scan
}
,
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
      "FinalRejected",
      "forwarded_to_subdivision",
      "approved_by_subdivision",
      "rejected_by_subdivision",
      "forwarded_to_district"
    ],
    default: "Submitted"
  },
  
  // Workflow tracking
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
  
  // Subdivision review details
  subdivisionReview: {
    officer: String,
    action: { type: String, enum: ["approved", "rejected", "forwarded_to_district"] },
    notes: String,
    timestamp: Date
  },
  
  remarks: String,
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Claim",ClaimSchema);