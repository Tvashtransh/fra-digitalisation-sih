const Claim = require("../model/claim.js");
const Claimant =  require("../model/claimant.js");
const Admin = require("../model/admin.js");
const GramSabhaOfficer = require("../model/gramsabhaofficer.js");
const { createClaimNotification } = require('./notificationController');

const Counter = require("../model/counter.js");

// Utility function to determine claim visibility based on user role and location
const getClaimVisibilityFilter = async (userRole, userId, userData = null) => {
  const filter = {};
  
  if (userRole === 'SuperAdmin' || userRole === 'DLCOfficer') {
    // Super Admin and DLC Officers can see all claims
    return filter;
  }
  
  if (userRole === 'SDLCOfficer') {
    // SDLC Officers can see claims from their subdivision
    const admin = await Admin.findById(userId);
    if (admin && admin.assignedSubdivision) {
      filter.tehsil = admin.assignedSubdivision; // Fixed: use claim's tehsil field
    }
    return filter;
  }
  
  if (userRole === 'GramSabha') {
    // Gram Sabha Officers can see claims from their specific Gram Panchayat
    const admin = await Admin.findById(userId);
    if (admin && admin.assignedGpCode) {
      filter.gpCode = admin.assignedGpCode;
    }
    return filter;
  }
  
  // Default: no access
  return { _id: { $exists: false } };
};

// New function to handle GS authentication system
const getGSClaimVisibilityFilter = (gsData) => {
  const filter = {};
  
  if (gsData && gsData.gpCode) {
    // GS Officers can see claims from their specific Gram Panchayat
    filter.gpCode = gsData.gpCode;
  } else {
    // Default: no access
    return { _id: { $exists: false } };
  }
  
  return filter;
};
async function getNextPattaId() {
  const counter = await Counter.findOneAndUpdate(
    { id: "patta" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  
  const year = new Date().getFullYear(); // 2025
  const padded = String(counter.seq).padStart(3, "0"); // 001, 002...
  return `FRA-${year}-${padded}`;
}

// Create a new claim (with claimant auto-handling)
module.exports.createClaim = async (req, res) => {
  try {
    const { claimType, forestLandArea, ifrData } = req.body;

    // 1. Check if claimant already exists by Aadhaar
    const pattaId = await getNextPattaId();
    let claimant = await Claimant.findOne({ _id:req.user.id });
    // 2. If not, create new claimant
    if (!claimant) {
      res.status(403).json({error:"claim cannot be created"});
    }

    // 3. If user doesn't have FRA ID yet, assign it to their profile
    if (!claimant.fraId) {
      claimant.fraId = pattaId;
      await claimant.save();
    }

    // 4. Check existing claims and enforce business rules
    const existingClaims = await Claim.find({ claimant: claimant._id })
      .sort({ createdAt: -1 });

    if (existingClaims.length > 0) {
      const latestClaim = existingClaims[0];
      const activeStatuses = ["Submitted", "RecommendedByGramSabha", "ApprovedBySDLC", "ApprovedByDLC"];
      const completedStatuses = ["ApprovedByDLC"]; // Assuming this means approved
      const rejectedStatuses = ["Rejected"];

      // Check if user has an active claim
      if (activeStatuses.includes(latestClaim.status)) {
        return res.status(400).json({ 
          error: "You already have an active claim in process",
          message: `Your claim ${latestClaim.frapattaid} is currently in ${latestClaim.status.replace(/([A-Z])/g, ' $1').trim()} status. Please wait for it to be processed or rejected before submitting a new claim.`,
          currentClaim: {
            id: latestClaim._id,
            frapattaid: latestClaim.frapattaid,
            status: latestClaim.status,
            createdAt: latestClaim.createdAt
          }
        });
      }

      // Check if user has an approved claim
      if (completedStatuses.includes(latestClaim.status)) {
        return res.status(400).json({ 
          error: "You already have an approved claim",
          message: `Your claim ${latestClaim.frapattaid} has been approved. You cannot submit another claim.`,
          currentClaim: {
            id: latestClaim._id,
            frapattaid: latestClaim.frapattaid,
            status: latestClaim.status,
            createdAt: latestClaim.createdAt
          }
        });
      }

      // If latest claim was rejected, allow new submission
      if (rejectedStatuses.includes(latestClaim.status)) {
        console.log(`User ${claimant._id} can submit new claim as previous claim ${latestClaim.frapattaid} was rejected`);
      }
    }

    // derive gpCode by matching gpName from our datasets (optional)
    let gpCode = undefined;
    try {
      const fsp = require('fs');
      const pth = require('path');
      const pick = (file)=>JSON.parse(fsp.readFileSync(pth.join(__dirname,'..','data',file),'utf8'));
      const arr = [...pick('berasia-gp.json'), ...pick('phanda-gp.json')];
      const hit = arr.find(x => (x.gpName||'').toLowerCase() === (ifrData?.applicantDetails?.gramPanchayat||'').toLowerCase());
      
      if (hit?.gpCode) {
        // Convert numeric GP code to full format for GS officer matching
        const tehsil = ifrData?.applicantDetails?.tehsil || '';
        if (tehsil.toLowerCase() === 'phanda') {
          gpCode = `GS-PHN-${hit.gpCode}`;
        } else if (tehsil.toLowerCase() === 'berasia') {
          gpCode = `GS-BRS-${hit.gpCode}`;
        } else {
          gpCode = hit.gpCode; // fallback to original
        }
        console.log(`✅ Assigned GP Code: ${gpCode} for village: ${ifrData?.applicantDetails?.gramPanchayat}`);
      } else {
        console.log(`❌ No GP code found for village: ${ifrData?.applicantDetails?.gramPanchayat}`);
      }
    } catch (error) {
      console.error('Error assigning GP code:', error);
    }

    // Calculate total area claimed
    const totalAreaClaimed = (ifrData?.landDetails?.extentHabitation || 0) + 
                           (ifrData?.landDetails?.extentSelfCultivation || 0);

    // 3. Create new claim linked to claimant with structured IFR data
    const claim = new Claim({
      claimType,
      forestLandArea,
      claimant: claimant._id,
      frapattaid: pattaId,
      gramPanchayat: ifrData?.applicantDetails?.gramPanchayat,
      tehsil: ifrData?.applicantDetails?.tehsil,
      district: ifrData?.applicantDetails?.district || 'Bhopal',
      gpCode,
      
      // Structured IFR data
      applicantDetails: ifrData?.applicantDetails || {},
      eligibilityStatus: ifrData?.eligibilityStatus || {},
      landDetails: {
        ...ifrData?.landDetails,
        totalAreaClaimed: totalAreaClaimed
      },
      claimBasis: ifrData?.claimBasis || {},
      evidence: ifrData?.evidence || {},
      declaration: ifrData?.declaration || {}
    });

    await claim.save();

    // Create notification for Gram Sabha officer
    try {
      await createClaimNotification(claim);
    } catch (notificationError) {
      console.error('Failed to create notification:', notificationError);
      // Don't fail the claim creation if notification fails
    }

    res.status(201).json({
      message: "Claim submitted successfully",
      claimId: claim._id,
      claimantId: claimant._id,
      frapattaid: pattaId
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports.fileupload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;

    // 👉 Call OCR service (replace with actual API call)
    // Example:
    // const ocrResponse = await axios.post("http://ocr-service/extract", { filePath });
    
    // Mock data for now
    const ocrResponse = {
      claimantName: "Raghav",
      village: "Indore",
      surveyNumber: "12345",
      landArea: "2.5 Acres"
    };

    // 👉 IMPORTANT: Don't save to DB here
    res.status(200).json({
      message: "Patta uploaded & data extracted",
      extractedData: ocrResponse,
      filePath: filePath // optional: if frontend needs to show uploaded file
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Check if user can submit a new claim
module.exports.canSubmitClaim = async (req, res) => {
  try {
    const claims = await Claim.find({ claimant: req.user.id })
      .sort({ createdAt: -1 });
    
    if (claims.length === 0) {
      return res.status(200).json({
        success: true,
        canSubmit: true,
        reason: "No previous claims found"
      });
    }
    
    const latestClaim = claims[0];
    const activeStatuses = ["Submitted", "RecommendedByGramSabha", "ApprovedBySDLC", "ApprovedByDLC"];
    const completedStatuses = ["ApprovedByDLC"];
    const rejectedStatuses = ["Rejected"];
    
    if (activeStatuses.includes(latestClaim.status)) {
      return res.status(200).json({
        success: true,
        canSubmit: false,
        reason: "You have an active claim in process",
        currentClaim: {
          id: latestClaim._id,
          frapattaid: latestClaim.frapattaid,
          status: latestClaim.status,
          createdAt: latestClaim.createdAt
        }
      });
    }
    
    if (completedStatuses.includes(latestClaim.status)) {
      return res.status(200).json({
        success: true,
        canSubmit: false,
        reason: "Your claim has been approved and title granted",
        currentClaim: {
          id: latestClaim._id,
          frapattaid: latestClaim.frapattaid,
          status: latestClaim.status,
          createdAt: latestClaim.createdAt
        }
      });
    }
    
    if (rejectedStatuses.includes(latestClaim.status)) {
      return res.status(200).json({
        success: true,
        canSubmit: true,
        reason: "Your previous claim was rejected, you can submit a new one",
        previousClaim: {
          id: latestClaim._id,
          frapattaid: latestClaim.frapattaid,
          status: latestClaim.status,
          createdAt: latestClaim.createdAt,
          remarks: latestClaim.remarks
        }
      });
    }
    
    // Default case - allow submission
    res.status(200).json({
      success: true,
      canSubmit: true,
      reason: "No restrictions found"
    });
  } catch (error) {
    console.error('Check claim eligibility error:', error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// Get all claims for a claimant
module.exports.getUserClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ claimant: req.user.id })
      .populate('claimant', 'name aadhaarNumber village')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      claims: claims
    });
  } catch (error) {
    console.error('Get user claims error:', error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// Get specific claim details
module.exports.getClaimDetails = async (req, res) => {
  try {
    const { claimId } = req.params;
    const claim = await Claim.findById(claimId)
      .populate('claimant', 'name aadhaarNumber village gramPanchayat tehsil district');
    
    if (!claim) {
      return res.status(404).json({ message: "Claim not found", success: false });
    }
    
    let hasAccess = false;
    let userRole = 'Unknown';
    
    // Check if this is a GS authentication (req.gs exists)
    if (req.gs) {
      userRole = 'GS';
      // GS Officers can see claims from their specific Gram Panchayat
      if (claim.gpCode === req.gs.gpCode) {
        hasAccess = true;
      }
    } else if (req.user) {
      // Regular admin authentication
      userRole = req.user.role;
      const userId = req.user.id;
      
      if (userRole === 'Claimant') {
        // Claimants can only see their own claims
        if (claim.claimant._id.toString() === userId) {
          hasAccess = true;
        }
      } else {
        // For officials, check location-based access
        if (userRole === 'SuperAdmin' || userRole === 'DLCOfficer') {
          hasAccess = true;
        } else if (userRole === 'SDLCOfficer') {
          const admin = await Admin.findById(userId);
          if (admin && admin.assignedSubdivision && claim.tehsil === admin.assignedSubdivision) {
            hasAccess = true;
          }
        } else if (userRole === 'GramSabha') {
          const admin = await Admin.findById(userId);
          if (admin && admin.assignedGpCode && claim.gpCode === admin.assignedGpCode) {
            hasAccess = true;
          }
        }
      }
    } else {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }
    
    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied - claim not in your jurisdiction", success: false });
    }
    
    res.status(200).json({
      success: true,
      claim: claim
    });
  } catch (error) {
    console.error('Get claim details error:', error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// Update claim status (for officials)
module.exports.updateClaimStatus = async (req, res) => {
  try {
    const { claimId } = req.params;
    const { status, remarks } = req.body;
    
    const validStatuses = ["Submitted", "RecommendedByGramSabha", "ApprovedBySDLC", "ApprovedByDLC", "Rejected"];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status", success: false });
    }
    
    // First, get the claim to check access
    const claim = await Claim.findById(claimId);
    if (!claim) {
      return res.status(404).json({ message: "Claim not found", success: false });
    }
    
    let hasAccess = false;
    let userRole = 'Unknown';
    
    // Check if this is a GS authentication (req.gs exists)
    if (req.gs) {
      userRole = 'GS';
      // GS Officers can update claims from their specific Gram Panchayat
      if (claim.gpCode === req.gs.gpCode) {
        hasAccess = true;
      }
    } else if (req.user) {
      // Regular admin authentication
      userRole = req.user.role;
      const userId = req.user.id;
      
      if (userRole === 'SuperAdmin' || userRole === 'DLCOfficer') {
        hasAccess = true;
      } else if (userRole === 'SDLCOfficer') {
        const admin = await Admin.findById(userId);
        if (admin && admin.assignedSubdivision && claim.tehsil === admin.assignedSubdivision) {
          hasAccess = true;
        }
      } else if (userRole === 'GramSabha') {
        const admin = await Admin.findById(userId);
        if (admin && admin.assignedGpCode && claim.gpCode === admin.assignedGpCode) {
          hasAccess = true;
        }
      }
    } else {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }
    
    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied - claim not in your jurisdiction", success: false });
    }
    
    // Update the claim
    const updatedClaim = await Claim.findByIdAndUpdate(
      claimId,
      { 
        status: status,
        remarks: remarks || claim.remarks,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('claimant', 'name aadhaarNumber village');
    
    res.status(200).json({
      success: true,
      message: "Claim status updated successfully",
      claim: updatedClaim
    });
  } catch (error) {
    console.error('Update claim status error:', error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// Get claims by status (for officials)
module.exports.getClaimsByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const validStatuses = ["Submitted", "RecommendedByGramSabha", "ApprovedBySDLC", "ApprovedByDLC", "Rejected"];
    
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status", success: false });
    }
    
    let locationFilter = {};
    let userRole = 'Unknown';
    
    // Check if this is a GS authentication (req.gs exists)
    if (req.gs) {
      userRole = 'GS';
      locationFilter = getGSClaimVisibilityFilter(req.gs);
    } else if (req.user) {
      // Regular admin authentication
      userRole = req.user.role;
      const userId = req.user.id;
      locationFilter = await getClaimVisibilityFilter(userRole, userId);
    } else {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }
    
    // Combine status filter with location filter
    const filter = { ...locationFilter };
    if (status) {
      filter.status = status;
    }
    
    const claims = await Claim.find(filter)
      .populate('claimant', 'name aadhaarNumber village gramPanchayat tehsil district')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      claims: claims,
      filter: locationFilter, // For debugging
      userRole: userRole
    });
  } catch (error) {
    console.error('Get claims by status error:', error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

