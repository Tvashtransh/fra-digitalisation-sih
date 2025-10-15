const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../model/admin.js');

// Subdivision Officer Login
module.exports.subdivisionLogin = async (req, res) => {
  try {
    const { officerId, password } = req.body;

    if (!officerId || !password) {
      return res.status(400).json({ message: 'Officer ID and password are required', success: false });
    }

    // Find subdivision officer
    const officer = await Admin.findOne({ 
      subdivisionId: officerId,
      role: 'SDLCOfficer'
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
        subdivisionId: officer.subdivisionId,
        role: 'SDLCOfficer',
        subdivision: officer.assignedSubdivision
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set cookie
    res.cookie('subdivision_token', token, {
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
        subdivisionId: officer.subdivisionId,
        name: officer.name,
        subdivision: officer.assignedSubdivision,
        role: officer.role
      }
    });
  } catch (error) {
    console.error('Subdivision login error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Get Subdivision Officer Profile
module.exports.getSubdivisionProfile = async (req, res) => {
  try {
    const officerData = req.subdivision;
    
    res.status(200).json({
      success: true,
      officer: {
        id: officerData._id,
        subdivisionId: officerData.subdivisionId,
        name: officerData.name,
        email: officerData.email,
        phone: officerData.contactNumber,
        subdivision: officerData.assignedSubdivision,
        role: officerData.role
      }
    });
  } catch (error) {
    console.error('Get subdivision profile error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Get claims for subdivision officer (view only)
module.exports.getSubdivisionClaims = async (req, res) => {
  try {
    const Claim = require('../model/claim.js');
    const officerData = req.subdivision;

    // Get claims forwarded to subdivision - filter by subdivision jurisdiction
    let subdivisionFilter = {};
    
    // Filter by subdivision based on officer's jurisdiction
    if (officerData.subdivisionId === 'PHN001') {
      // Phanda subdivision officer - show claims from Phanda villages (GP codes: GS-PHN-*)
      subdivisionFilter = {
        gpCode: { $regex: '^GS-PHN-', $options: 'i' },
        status: { $in: ['ForwardedToSubdivision', 'UnderSubdivisionReview', 'ApprovedBySubdivision', 'RejectedBySubdivision'] }
      };
    } else if (officerData.subdivisionId === 'BRS001') {
      // Berasia subdivision officer - show claims from Berasia villages (GP codes: GS-BRS-*)
      subdivisionFilter = {
        gpCode: { $regex: '^GS-BRS-', $options: 'i' },
        status: { $in: ['ForwardedToSubdivision', 'UnderSubdivisionReview', 'ApprovedBySubdivision', 'RejectedBySubdivision'] }
      };
    } else {
      // Fallback - show all claims with subdivision statuses
      subdivisionFilter = {
        status: { $in: ['ForwardedToSubdivision', 'UnderSubdivisionReview', 'ApprovedBySubdivision', 'RejectedBySubdivision'] }
      };
    }
    
    const claims = await Claim.find(subdivisionFilter)
    .populate('claimant', 'name email phone')
    .sort({ createdAt: -1 });

    const formattedClaims = claims.map(claim => ({
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
      createdAt: claim.createdAt,
      gramPanchayat: claim.gramPanchayat,
      tehsil: claim.tehsil,
      district: claim.district
    }));

    res.status(200).json({
      success: true,
      claims: formattedClaims
    });
  } catch (error) {
    console.error('Get subdivision claims error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Get specific claim details (view only)
module.exports.getSubdivisionClaimDetails = async (req, res) => {
  try {
    const Claim = require('../model/claim.js');
    const { claimId } = req.params;

    const claim = await Claim.findById(claimId)
      .populate('claimant', 'name email phone')
      .populate('workflow.gsOfficer.officerId', 'name email');

    if (!claim) {
      return res.status(404).json({ message: "Claim not found", success: false });
    }

    res.status(200).json({
      success: true,
      claim: claim
    });
  } catch (error) {
    console.error('Get subdivision claim details error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Review claim (view only - no changes)
module.exports.reviewClaim = async (req, res) => {
  try {
    const Claim = require('../model/claim.js');
    const { claimId } = req.params;
    const { remarks } = req.body;
    const officerData = req.subdivision;

    const claim = await Claim.findById(claimId);
    if (!claim) {
      return res.status(404).json({ message: "Claim not found", success: false });
    }

    // Update workflow to mark as reviewed
    claim.status = 'UnderSubdivisionReview';
    claim.workflow.subdivisionOfficer = {
      officerId: officerData._id,
      action: 'reviewed',
      actionDate: new Date(),
      remarks: remarks || 'Claim reviewed by Subdivision Officer'
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

// Approve claim and forward to district
module.exports.approveAndForwardToDistrict = async (req, res) => {
  try {
    const Claim = require('../model/claim.js');
    const { claimId } = req.params;
    const { remarks } = req.body;
    const officerData = req.subdivision;

    const claim = await Claim.findById(claimId);
    if (!claim) {
      return res.status(404).json({ message: "Claim not found", success: false });
    }

    // Update status and workflow
    claim.status = 'ForwardedToDistrict';
    claim.workflow.subdivisionOfficer = {
      officerId: officerData._id,
      action: 'forwarded',
      actionDate: new Date(),
      remarks: remarks || 'Approved and forwarded to District Officer'
    };

    await claim.save();

    res.status(200).json({
      success: true,
      message: "Claim approved and forwarded to District Officer",
      claim: {
        id: claim._id,
        frapattaid: claim.frapattaid,
        status: claim.status,
        workflow: claim.workflow
      }
    });
  } catch (error) {
    console.error('Approve and forward claim error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Reject claim
module.exports.rejectClaim = async (req, res) => {
  try {
    const Claim = require('../model/claim.js');
    const { claimId } = req.params;
    const { remarks } = req.body;
    const officerData = req.subdivision;

    const claim = await Claim.findById(claimId);
    if (!claim) {
      return res.status(404).json({ message: "Claim not found", success: false });
    }

    // Update status and workflow
    claim.status = 'RejectedBySubdivision';
    claim.workflow.subdivisionOfficer = {
      officerId: officerData._id,
      action: 'rejected',
      actionDate: new Date(),
      remarks: remarks || 'Claim rejected by Subdivision Officer'
    };

    await claim.save();

    res.status(200).json({
      success: true,
      message: "Claim rejected",
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

// Subdivision Officer Logout
module.exports.subdivisionLogout = async (req, res) => {
  try {
    // Clear the subdivision_token cookie
    res.clearCookie('subdivision_token', {
      httpOnly: true,
      sameSite: 'lax'
    });
    
    res.status(200).json({ 
      message: "Subdivision officer logged out successfully", 
      success: true 
    });
  } catch (error) {
    console.error('Subdivision Logout error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};
