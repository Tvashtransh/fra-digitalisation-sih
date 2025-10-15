const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../model/admin.js');

// District Officer Login
module.exports.districtLogin = async (req, res) => {
  try {
    const { officerId, password } = req.body;

    if (!officerId || !password) {
      return res.status(400).json({ message: 'Officer ID and password are required', success: false });
    }

    // Find district officer
    const officer = await Admin.findOne({ 
      districtId: officerId,
      role: 'district_officer'
    });

    if (!officer) {
      return res.status(401).json({ message: 'Invalid credentials', success: false });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, officer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials', success: false });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        districtId: officer.districtId,
        role: 'district_officer',
        district: officer.assignedDistrict
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set cookie for authentication
    res.cookie('district_officer_token', token, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      officer: {
        id: officer._id,
        districtId: officer.districtId,
        name: officer.name,
        district: officer.assignedDistrict,
        role: officer.role
      }
    });
  } catch (error) {
    console.error('District login error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Get District Officer Profile
module.exports.getDistrictProfile = async (req, res) => {
  try {
    const officerData = req.district;
    
    res.status(200).json({
      success: true,
      officer: {
        id: officerData._id,
        districtId: officerData.districtId,
        name: officerData.name,
        email: officerData.email,
        contactNumber: officerData.contactNumber,
        district: officerData.assignedDistrict,
        role: officerData.role
      }
    });
  } catch (error) {
    console.error('Get district profile error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Get claims for district officer
module.exports.getDistrictClaims = async (req, res) => {
  try {
    const Claim = require('../model/claim.js');
    const officerData = req.district;

    // Get claims forwarded to district (from subdivision officers)
    const claims = await Claim.find({
      status: { $in: ['forwarded_to_district', 'UnderDistrictReview', 'FinalApproved', 'FinalRejected'] }
    })
    .populate('claimant', 'name email phone')
    .populate('workflow.gsOfficer.officerId', 'name')
    .populate('workflow.subdivisionOfficer.officerId', 'name')
    .sort({ createdAt: -1 });

    const formattedClaims = claims.map(claim => {
      // Determine subdivision based on gpCode
      let subdivision = 'Unknown';
      if (claim.gpCode) {
        if (claim.gpCode.startsWith('GS-PHN-')) {
          subdivision = 'Phanda';
        } else if (claim.gpCode.startsWith('GS-BRS-')) {
          subdivision = 'Berasia';
        }
      }

      return {
        id: claim._id,
        frapattaid: claim.frapattaid,
        claimantName: claim.applicantDetails.claimantName,
        claimType: claim.claimType,
        forestLandArea: claim.forestLandArea,
        status: claim.status,
        hasMap: !!claim.mapData && claim.mapData.areasJson,
        mapData: claim.mapData ? {
          areas: claim.mapData.areasJson ? JSON.parse(claim.mapData.areasJson) : [],
          totalArea: claim.mapData.totalArea,
          createdAt: claim.mapData.createdAt,
          updatedAt: claim.mapData.updatedAt
        } : null,
        workflow: claim.workflow,
        subdivisionReview: claim.subdivisionReview,
        createdAt: claim.createdAt,
        gramPanchayat: claim.gramPanchayat,
        tehsil: claim.tehsil,
        district: claim.district,
        subdivision: subdivision,
        gpCode: claim.gpCode
      };
    });

    // Group claims by subdivision for better organization
    const claimsBySubdivision = {
      Phanda: formattedClaims.filter(claim => claim.subdivision === 'Phanda'),
      Berasia: formattedClaims.filter(claim => claim.subdivision === 'Berasia'),
      Unknown: formattedClaims.filter(claim => claim.subdivision === 'Unknown')
    };

    res.status(200).json({
      success: true,
      claims: formattedClaims,
      claimsBySubdivision: claimsBySubdivision,
      officer: {
        name: officerData.name,
        districtId: officerData.districtId,
        district: officerData.assignedDistrict
      }
    });
  } catch (error) {
    console.error('Get district claims error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Get specific claim details
module.exports.getDistrictClaimDetails = async (req, res) => {
  try {
    const Claim = require('../model/claim.js');
    const { claimId } = req.params;

    const claim = await Claim.findById(claimId)
      .populate('claimant', 'name email phone')
      .populate('workflow.gsOfficer.officerId', 'name email')
      .populate('workflow.subdivisionOfficer.officerId', 'name email');

    if (!claim) {
      return res.status(404).json({ message: "Claim not found", success: false });
    }

    res.status(200).json({
      success: true,
      claim: claim
    });
  } catch (error) {
    console.error('Get district claim details error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Review claim
module.exports.reviewClaim = async (req, res) => {
  try {
    const Claim = require('../model/claim.js');
    const { claimId } = req.params;
    const { remarks } = req.body;
    const officerData = req.district;

    const claim = await Claim.findById(claimId);
    if (!claim) {
      return res.status(404).json({ message: "Claim not found", success: false });
    }

    // Update workflow to mark as reviewed
    claim.status = 'UnderDistrictReview';
    claim.workflow.districtOfficer = {
      officerId: officerData._id,
      action: 'reviewed',
      actionDate: new Date(),
      remarks: remarks || 'Claim reviewed by District Officer'
    };

    await claim.save();

    res.status(200).json({
      success: true,
      message: "Claim marked as reviewed",
      claim: {
        id: claim._id,
        frapattaid: claim.frapattaid,
        status: claim.status,
        workflow: claim.workflow
      }
    });
  } catch (error) {
    console.error('Review claim error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Final approve claim
module.exports.finalApproveClaim = async (req, res) => {
  try {
    const Claim = require('../model/claim.js');
    const { claimId } = req.params;
    const { remarks } = req.body;
    const officerData = req.district;

    const claim = await Claim.findById(claimId);
    if (!claim) {
      return res.status(404).json({ message: "Claim not found", success: false });
    }

    // Update status and workflow - Title Granted for IFR approval
    claim.status = 'Title Granted';
    claim.workflow.districtOfficer = {
      officerId: officerData._id,
      action: 'approved',
      actionDate: new Date(),
      remarks: remarks || 'Individual Forest Right approved and title granted by District Officer'
    };

    await claim.save();

    res.status(200).json({
      success: true,
      message: "Claim finally approved",
      claim: {
        id: claim._id,
        frapattaid: claim.frapattaid,
        status: claim.status,
        workflow: claim.workflow
      }
    });
  } catch (error) {
    console.error('Final approve claim error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Final reject claim
module.exports.finalRejectClaim = async (req, res) => {
  try {
    const Claim = require('../model/claim.js');
    const { claimId } = req.params;
    const { remarks } = req.body;
    const officerData = req.district;

    const claim = await Claim.findById(claimId);
    if (!claim) {
      return res.status(404).json({ message: "Claim not found", success: false });
    }

    // Update status and workflow
    claim.status = 'FinalRejected';
    claim.workflow.districtOfficer = {
      officerId: officerData._id,
      action: 'rejected',
      actionDate: new Date(),
      remarks: remarks || 'Claim finally rejected by District Officer'
    };

    await claim.save();

    res.status(200).json({
      success: true,
      message: "Claim finally rejected",
      claim: {
        id: claim._id,
        frapattaid: claim.frapattaid,
        status: claim.status,
        workflow: claim.workflow
      }
    });
  } catch (error) {
    console.error('Final reject claim error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// District Officer Logout
module.exports.districtLogout = async (req, res) => {
  try {
    // Clear the district_token cookie
    res.clearCookie('district_token', {
      httpOnly: true,
      sameSite: 'lax'
    });
    
    res.status(200).json({ 
      message: "District officer logged out successfully", 
      success: true 
    });
  } catch (error) {
    console.error('District Logout error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};