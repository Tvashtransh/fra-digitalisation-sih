const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../model/admin');

module.exports.gsLogin = async (req, res) => {
  try {
    const { gramSabhaId, password } = req.body || {};
    if (!gramSabhaId || !password) return res.status(400).json({ message: 'All fields are required' });

    // Look for Gram Sabha officer in Admin model with role 'GramSabha'
    const officer = await Admin.findOne({ 
      role: 'GramSabha',
      $or: [
        { email: gramSabhaId },
        { assignedGpCode: gramSabhaId }
      ]
    });
    
    if (!officer) {
      console.log('GS Login attempt failed - officer not found:', gramSabhaId);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, officer.password);
    if (!ok) {
      console.log('GS Login attempt failed - wrong password for:', gramSabhaId);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ 
      role: 'GS', 
      gpCode: officer.assignedGpCode, 
      gpName: officer.assignedGramPanchayat, 
      subdivision: officer.assignedSubdivision, 
      district: officer.assignedDistrict, 
      id: officer._id 
    }, process.env.JWT_SECRET || 'fra_secret', { expiresIn: '1d' });
    
    res.cookie('gs_token', token, { httpOnly: true, sameSite: 'lax' });
    return res.status(200).json({ 
      success: true, 
      gpCode: officer.assignedGpCode, 
      gpName: officer.assignedGramPanchayat, 
      subdivision: officer.assignedSubdivision, 
      district: officer.assignedDistrict 
    });
  } catch (e) {
    console.error('GS Login error:', e);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get Gram Sabha officer profile
module.exports.getGSProfile = async (req, res) => {
  try {
    const { Admin } = require('../model/admin');
    
    // Get full officer data from database
    const officer = await Admin.findById(req.gs.id).select('-password');
    
    if (!officer) {
      return res.status(404).json({ message: 'Officer not found', success: false });
    }
    
    res.status(200).json({
      success: true,
      officer: {
        id: officer._id,
        name: officer.name,
        email: officer.email,
        contactNumber: officer.contactNumber,
        gramSabhaId: officer.email, // Using email as gramSabhaId
        gpCode: officer.assignedGpCode,
        gpName: officer.assignedGramPanchayat,
        subdivision: officer.assignedSubdivision,
        district: officer.assignedDistrict,
        village: officer.assignedVillage,
        villages: [] // Can be added later if needed
      }
    });
  } catch (error) {
    console.error('Get GS profile error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Update Gram Sabha officer profile
module.exports.updateGSProfile = async (req, res) => {
  try {
    const { Admin } = require('../model/admin');
    const { name, email, contactNumber, assignedVillage } = req.body;
    
    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ 
        message: 'Name and email are required', 
        success: false 
      });
    }
    
    // Check if email is already taken by another officer
    const existingOfficer = await Admin.findOne({ 
      email: email, 
      _id: { $ne: req.gs.id } 
    });
    
    if (existingOfficer) {
      return res.status(400).json({ 
        message: 'Email already in use by another officer', 
        success: false 
      });
    }
    
    // Update officer profile
    const updatedOfficer = await Admin.findByIdAndUpdate(
      req.gs.id,
      {
        name,
        email,
        contactNumber,
        assignedVillage
      },
      { new: true, select: '-password' }
    );
    
    if (!updatedOfficer) {
      return res.status(404).json({ 
        message: 'Officer not found', 
        success: false 
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      officer: {
        id: updatedOfficer._id,
        name: updatedOfficer.name,
        email: updatedOfficer.email,
        contactNumber: updatedOfficer.contactNumber,
        gramSabhaId: updatedOfficer.email,
        gpCode: updatedOfficer.assignedGpCode,
        gpName: updatedOfficer.assignedGramPanchayat,
        subdivision: updatedOfficer.assignedSubdivision,
        district: updatedOfficer.assignedDistrict,
        village: updatedOfficer.assignedVillage
      }
    });
  } catch (error) {
    console.error('Update GS profile error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Get claims for Gram Sabha officer (from their assigned Gram Panchayat)
module.exports.getGSClaims = async (req, res) => {
  try {
    const Claim = require('../model/claim.js');
    const officerData = req.gs;
    
    // Find claims from the officer's assigned Gram Panchayat
    const claims = await Claim.find({ gpCode: officerData.gpCode })
      .populate('claimant', 'name aadhaarNumber village gramPanchayat tehsil district')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      claims: claims,
      officer: {
        gpCode: officerData.gpCode,
        gpName: officerData.gpName,
        subdivision: officerData.subdivision,
        district: officerData.district
      }
    });
  } catch (error) {
    console.error('Get GS claims error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Get specific claim details for Gram Sabha officer
module.exports.getGSClaimDetails = async (req, res) => {
  try {
    const Claim = require('../model/claim.js');
    const { claimId } = req.params;
    const officerData = req.gs;
    
    // Find the specific claim
    const claim = await Claim.findById(claimId)
      .populate('claimant', 'name aadhaarNumber village gramPanchayat tehsil district');
    
    if (!claim) {
      return res.status(404).json({ message: "Claim not found", success: false });
    }
    
    // Check if the claim belongs to the officer's Gram Panchayat
    if (claim.gpCode !== officerData.gpCode) {
      return res.status(403).json({ 
        message: "Access denied - claim not in your jurisdiction", 
        success: false 
      });
    }
    
    res.status(200).json({
      success: true,
      claim: claim
    });
  } catch (error) {
    console.error('Get GS claim details error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Save map data for a claim
module.exports.saveClaimMap = async (req, res) => {
  try {
    console.log('Save claim map request:', req.params, req.body);
    
    const Claim = require('../model/claim.js');
    const { claimId } = req.params;
    const { mapData } = req.body;
    const officerData = req.gs;
    
    console.log('Claim ID:', claimId);
    console.log('Map Data:', mapData);
    console.log('Officer Data:', officerData);
    
    // Find the claim
    const claim = await Claim.findById(claimId);
    
    if (!claim) {
      console.log('Claim not found:', claimId);
      return res.status(404).json({ message: "Claim not found", success: false });
    }
    
    console.log('Found claim:', claim.frapattaid, 'GP Code:', claim.gpCode);
    
    // Check if the claim belongs to the officer's Gram Panchayat
    if (claim.gpCode !== officerData.gpCode) {
      console.log('Access denied - GP Code mismatch:', claim.gpCode, 'vs', officerData.gpCode);
      return res.status(403).json({ 
        message: "Access denied - claim not in your jurisdiction", 
        success: false 
      });
    }
    
    // Validate map data
    if (!mapData || !mapData.areas || !Array.isArray(mapData.areas)) {
      console.log('Invalid map data format:', mapData);
      return res.status(400).json({ 
        message: "Invalid map data format", 
        success: false 
      });
    }
    
    // Store map data as a JSON string to avoid schema conflicts
    claim.mapData = {
      areasJson: JSON.stringify(mapData.areas),
      totalArea: mapData.totalArea,
      createdAt: claim.mapData?.createdAt || new Date(),
      updatedAt: new Date()
    };
    
    // Update claim status to indicate it has been mapped
    if (claim.status === 'Submitted') {
      claim.status = 'MappedByGramSabha';
    }
    
    // Update workflow to track GS officer action
    claim.workflow.gsOfficer = {
      officerId: officerData._id,
      action: 'mapped',
      actionDate: new Date(),
      remarks: 'Land area mapped by GS Officer'
    };
    
    console.log('Saving claim with map data...');
    await claim.save();
    console.log('Claim saved successfully');
    
    // Parse areas back to objects for response
    const responseMapData = {
      areas: JSON.parse(claim.mapData.areasJson),
      totalArea: claim.mapData.totalArea,
      createdAt: claim.mapData.createdAt,
      updatedAt: claim.mapData.updatedAt
    };
    
    res.status(200).json({ 
      success: true, 
      message: "Map data saved successfully",
      claim: {
        id: claim._id,
        frapattaid: claim.frapattaid,
        status: claim.status,
        mapData: responseMapData
      }
    });
  } catch (error) {
    console.error('Save claim map error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      message: 'Server error', 
      success: false,
      error: error.message 
    });
  }
};

// Forward claim to subdivision officer
module.exports.forwardClaimToSubdivision = async (req, res) => {
  try {
    const Claim = require('../model/claim.js');
    const { claimId } = req.params;
    const { remarks } = req.body;
    const officerData = req.gs;

    const claim = await Claim.findById(claimId);
    if (!claim) {
      return res.status(404).json({ message: "Claim not found", success: false });
    }

    // Check jurisdiction
    if (claim.gpCode !== officerData.gpCode) {
      return res.status(403).json({ 
        message: "Access denied - claim not in your jurisdiction", 
        success: false 
      });
    }

    // Check if claim has been mapped
    if (claim.status !== 'MappedByGramSabha') {
      return res.status(400).json({ 
        message: "Claim must be mapped before forwarding", 
        success: false 
      });
    }

    // Update claim status and workflow
    claim.status = 'ForwardedToSubdivision';
    claim.workflow.gsOfficer = {
      officerId: officerData._id,
      action: 'forwarded',
      actionDate: new Date(),
      remarks: remarks || 'Forwarded to Subdivision Officer for review'
    };

    await claim.save();

    res.status(200).json({
      success: true,
      message: "Claim forwarded to Subdivision Officer successfully",
      claim: {
        id: claim._id,
        frapattaid: claim.frapattaid,
        status: claim.status,
        workflow: claim.workflow
      }
    });
  } catch (error) {
    console.error('Forward claim error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Gram Sabha Logout
module.exports.gsLogout = async (req, res) => {
  try {
    // Clear the gs_token cookie
    res.clearCookie('gs_token', {
      httpOnly: true,
      sameSite: 'lax'
    });
    
    res.status(200).json({ 
      message: "Gram Sabha officer logged out successfully", 
      success: true 
    });
  } catch (error) {
    console.error('GS Logout error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};


