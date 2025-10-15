const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../model/admin.js');

// Block Officer Login
module.exports.blockOfficerLogin = async (req, res) => {
  try {
    const { officerId, password } = req.body;

    if (!officerId || !password) {
      return res.status(400).json({ message: 'Officer ID and password are required', success: false });
    }

    // Find block officer
    const officer = await Admin.findOne({ 
      districtId: officerId,
      role: 'block_officer'
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
        role: 'block_officer',
        district: officer.assignedDistrict
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set cookie for authentication
    res.cookie('block_officer_token', token, {
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
    console.error('Block Officer login error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Get Block Officer Profile
module.exports.getBlockOfficerProfile = async (req, res) => {
  try {
    const officerId = req.blockOfficer.districtId;
    
    const officer = await Admin.findOne({ districtId: officerId });
    
    if (!officer) {
      return res.status(404).json({ message: 'Officer not found', success: false });
    }

    res.status(200).json({
      success: true,
      officer: {
        id: officer._id,
        districtId: officer.districtId,
        name: officer.name,
        district: officer.assignedDistrict,
        role: officer.role
      }
    });
  } catch (error) {
    console.error('Get block officer profile error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Get Claims for Subdivision Officer (filtered by subdivision)
module.exports.getBlockOfficerClaims = async (req, res) => {
  try {
    const Claim = require('../model/claim.js');
    const officerData = req.blockOfficer;
    
    // Determine subdivision based on officer's districtId
    let subdivisionFilter = {};
    
    if (officerData.districtId === 'PHN001') {
      // Phanda subdivision officer - show claims from Phanda villages (GP codes: GS-PHN-*)
      subdivisionFilter = {
        gpCode: { $regex: '^GS-PHN-', $options: 'i' }
      };
      console.log('Phanda officer - filtering for GS-PHN-* villages');
    } else if (officerData.districtId === 'BRS001') {
      // Berasia subdivision officer - show claims from Berasia villages (GP codes: GS-BRS-*)
      subdivisionFilter = {
        gpCode: { $regex: '^GS-BRS-', $options: 'i' }
      };
      console.log('Berasia officer - filtering for GS-BRS-* villages');
    } else {
      // Fallback - show all claims (for backward compatibility)
      console.log('Unknown subdivision officer - showing all claims');
    }
    
    // Find claims based on subdivision
    const claims = await Claim.find(subdivisionFilter)
      .populate('claimant', 'name aadhaarNumber village gramPanchayat tehsil district')
      .sort({ createdAt: -1 });
    
    // Parse map data for each claim
    const claimsWithParsedMapData = claims.map(claim => {
      const claimObj = claim.toObject();
      
      // Parse mapData.areasJson if it exists
      if (claimObj.mapData && claimObj.mapData.areasJson) {
        try {
          claimObj.mapData.areas = JSON.parse(claimObj.mapData.areasJson);
        } catch (error) {
          console.error('Error parsing map data for claim:', claimObj.frapattaid, error);
          claimObj.mapData.areas = [];
        }
      }
      
      return claimObj;
    });
    
    res.status(200).json({
      success: true,
      claims: claimsWithParsedMapData,
      officer: {
        districtId: officerData.districtId,
        district: officerData.district,
        role: officerData.role,
        name: officerData.name,
        subdivision: officerData.assignedSubdivision
      }
    });
  } catch (error) {
    console.error('Get block officer claims error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Approve claim by subdivision officer
module.exports.approveClaimBySubdivision = async (req, res) => {
  try {
    const { claimId } = req.params;
    const { notes, subdivisionOfficer, timestamp } = req.body;
    const Claim = require('../model/claim.js');

    const claim = await Claim.findById(claimId);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found', success: false });
    }

    // Update claim status and add subdivision review
    claim.status = 'approved_by_subdivision';
    claim.subdivisionReview = {
      officer: subdivisionOfficer,
      action: 'approved',
      notes: notes,
      timestamp: new Date(timestamp)
    };

    await claim.save();

    res.status(200).json({
      success: true,
      message: 'Claim approved by subdivision officer',
      claim: claim
    });

  } catch (error) {
    console.error('Approve claim error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Reject claim by subdivision officer
module.exports.rejectClaimBySubdivision = async (req, res) => {
  try {
    const { claimId } = req.params;
    const { notes, subdivisionOfficer, timestamp } = req.body;
    const Claim = require('../model/claim.js');

    const claim = await Claim.findById(claimId);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found', success: false });
    }

    // Update claim status and add subdivision review
    claim.status = 'rejected_by_subdivision';
    claim.subdivisionReview = {
      officer: subdivisionOfficer,
      action: 'rejected',
      notes: notes,
      timestamp: new Date(timestamp)
    };

    await claim.save();

    res.status(200).json({
      success: true,
      message: 'Claim rejected by subdivision officer',
      claim: claim
    });

  } catch (error) {
    console.error('Reject claim error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Forward claim to district officer
module.exports.forwardClaimToDistrict = async (req, res) => {
  try {
    const { claimId } = req.params;
    const { notes, subdivisionOfficer, timestamp } = req.body;
    const Claim = require('../model/claim.js');

    const claim = await Claim.findById(claimId);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found', success: false });
    }

    // Update claim status and add subdivision review
    claim.status = 'forwarded_to_district';
    claim.subdivisionReview = {
      officer: subdivisionOfficer,
      action: 'forwarded_to_district',
      notes: notes,
      timestamp: new Date(timestamp)
    };

    await claim.save();

    res.status(200).json({
      success: true,
      message: 'Claim forwarded to district officer',
      claim: claim
    });

  } catch (error) {
    console.error('Forward claim error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Get specific claim details for Block Officer
module.exports.getBlockOfficerClaimDetails = async (req, res) => {
  try {
    const Claim = require('../model/claim.js');
    const { claimId } = req.params;
    
    const claim = await Claim.findById(claimId)
      .populate('claimant', 'name aadhaarNumber village gramPanchayat tehsil district');
    
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found', success: false });
    }
    
    // Parse map data if it exists
    const claimObj = claim.toObject();
    if (claimObj.mapData && claimObj.mapData.areasJson) {
      try {
        claimObj.mapData.areas = JSON.parse(claimObj.mapData.areasJson);
      } catch (error) {
        console.error('Error parsing map data for claim:', claimObj.frapattaid, error);
        claimObj.mapData.areas = [];
      }
    }
    
    res.status(200).json({
      success: true,
      claim: claimObj
    });
  } catch (error) {
    console.error('Get block officer claim details error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Approve claim (Final approval)
module.exports.approveClaim = async (req, res) => {
  try {
    const Claim = require('../model/claim.js');
    const { claimId } = req.params;
    const { remarks } = req.body;
    const officerData = req.blockOfficer;

    const claim = await Claim.findById(claimId);
    if (!claim) {
      return res.status(404).json({ message: "Claim not found", success: false });
    }

    // Update claim status and workflow
    claim.status = 'FinalApproved';
    claim.workflow.districtOfficer = {
      officerId: officerData.id,
      action: 'approved',
      actionDate: new Date(),
      remarks: remarks || 'Claim approved by District Officer'
    };

    await claim.save();

    res.status(200).json({
      success: true,
      message: "Claim approved successfully",
      claim: {
        id: claim._id,
        frapattaid: claim.frapattaid,
        status: claim.status,
        workflow: claim.workflow
      }
    });
  } catch (error) {
    console.error('Approve claim error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Reject claim (Final rejection)
module.exports.rejectClaim = async (req, res) => {
  try {
    const Claim = require('../model/claim.js');
    const { claimId } = req.params;
    const { remarks } = req.body;
    const officerData = req.blockOfficer;

    const claim = await Claim.findById(claimId);
    if (!claim) {
      return res.status(404).json({ message: "Claim not found", success: false });
    }

    // Update claim status and workflow
    claim.status = 'FinalRejected';
    claim.workflow.districtOfficer = {
      officerId: officerData.id,
      action: 'rejected',
      actionDate: new Date(),
      remarks: remarks || 'Claim rejected by District Officer'
    };

    await claim.save();

    res.status(200).json({
      success: true,
      message: "Claim rejected successfully",
      claim: {
        id: claim._id,
        frapattaid: claim.frapattaid,
        status: claim.status,
        workflow: claim.workflow
      }
    });
  } catch (error) {
    console.error('Reject claim error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Block Officer Logout
module.exports.blockOfficerLogout = async (req, res) => {
  try {
    // Clear the block_officer_token cookie
    res.clearCookie('block_officer_token', {
      httpOnly: true,
      sameSite: 'lax'
    });
    
    res.status(200).json({ 
      message: "Block officer logged out successfully", 
      success: true 
    });
  } catch (error) {
    console.error('Block Officer Logout error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};