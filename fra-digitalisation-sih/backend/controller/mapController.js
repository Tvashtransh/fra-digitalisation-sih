const Claim = require('../model/claim.js');

// Get map data based on user role and jurisdiction
module.exports.getMapData = async (req, res) => {
  try {
    const userRole = req.user?.role || req.gs?.role || req.blockOfficer?.role || req.district?.role;
    const userData = req.user || req.gs || req.blockOfficer || req.district;
    
    if (!userRole || !userData) {
      return res.status(401).json({ 
        success: false, 
        message: 'User authentication required' 
      });
    }

    let filter = {};
    let mapCenter = [77.4126, 23.2599]; // Default Bhopal coordinates
    let mapZoom = 10;

    // Apply role-based filtering
    switch (userRole) {
      case 'gram_sabha':
        // Gram Sabha Officer - only their village
        if (userData.gpCode) {
          filter.gpCode = userData.gpCode;
          mapZoom = 14; // Closer zoom for village level
        }
        break;
        
      case 'block_officer':
        // Block Officer - their entire subdivision
        if (userData.districtId === 'PHN001') {
          filter.gpCode = { $regex: '^GS-PHN-', $options: 'i' };
          mapCenter = [77.4126, 23.2599]; // Phanda area
        } else if (userData.districtId === 'BRS001') {
          filter.gpCode = { $regex: '^GS-BRS-', $options: 'i' };
          mapCenter = [77.4126, 23.2599]; // Berasia area
        }
        mapZoom = 12; // Block level zoom
        break;
        
      case 'district_officer':
        // District Officer - entire district
        filter = {}; // No filter - show all claims
        mapCenter = [77.4126, 23.2599]; // Bhopal district center
        mapZoom = 10; // District level zoom
        break;
        
      default:
        return res.status(403).json({ 
          success: false, 
          message: 'Invalid user role' 
        });
    }

    // Fetch claims with geometry data
    const claims = await Claim.find(filter)
      .populate('claimant', 'name aadhaarNumber village gramPanchayat tehsil district')
      .select('frapattaid applicantDetails status geometry gramPanchayat tehsil district gpCode createdAt')
      .sort({ createdAt: -1 });

    // Convert to GeoJSON FeatureCollection
    const features = claims
      .filter(claim => claim.geometry && claim.geometry.coordinates)
      .map(claim => ({
        type: 'Feature',
        geometry: claim.geometry,
        properties: {
          claimId: claim._id,
          frapattaid: claim.frapattaid,
          claimantName: claim.applicantDetails?.claimantName || 'Unknown',
          status: claim.status,
          village: claim.gramPanchayat,
          tehsil: claim.tehsil,
          district: claim.district,
          gpCode: claim.gpCode,
          createdAt: claim.createdAt,
          // Status-based styling
          fillColor: getStatusColor(claim.status),
          strokeColor: getStatusColor(claim.status)
        }
      }));

    const geoJsonData = {
      type: 'FeatureCollection',
      features: features
    };

    res.status(200).json({
      success: true,
      data: geoJsonData,
      mapConfig: {
        center: mapCenter,
        zoom: mapZoom,
        userRole: userRole,
        jurisdiction: getJurisdictionInfo(userRole, userData)
      },
      summary: {
        totalClaims: features.length,
        statusBreakdown: getStatusBreakdown(claims)
      }
    });

  } catch (error) {
    console.error('Get map data error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching map data' 
    });
  }
};

// Helper function to get status-based colors
function getStatusColor(status) {
  const statusColors = {
    'Submitted': '#3b82f6', // Blue
    'MappedByGramSabha': '#10b981', // Green
    'ForwardedToSubdivision': '#f59e0b', // Orange
    'UnderSubdivisionReview': '#f59e0b', // Orange
    'ApprovedBySubdivision': '#10b981', // Green
    'RejectedBySubdivision': '#ef4444', // Red
    'ForwardedToDistrict': '#8b5cf6', // Purple
    'UnderDistrictReview': '#8b5cf6', // Purple
    'ApprovedByDistrict': '#10b981', // Green
    'RejectedByDistrict': '#ef4444', // Red
    'FinalApproved': '#059669', // Dark Green
    'FinalRejected': '#dc2626' // Dark Red
  };
  
  return statusColors[status] || '#6b7280'; // Default gray
}

// Helper function to get jurisdiction information
function getJurisdictionInfo(role, userData) {
  switch (role) {
    case 'gram_sabha':
      return {
        level: 'Village',
        name: userData.gpName || 'Unknown Village',
        code: userData.gpCode
      };
    case 'block_officer':
      return {
        level: 'Subdivision',
        name: userData.districtId === 'PHN001' ? 'Phanda Subdivision' : 
              userData.districtId === 'BRS001' ? 'Berasia Subdivision' : 'Unknown Subdivision',
        code: userData.districtId
      };
    case 'district_officer':
      return {
        level: 'District',
        name: 'Bhopal District',
        code: 'BPL'
      };
    default:
      return { level: 'Unknown', name: 'Unknown', code: 'UNK' };
  }
}

// Helper function to get status breakdown
function getStatusBreakdown(claims) {
  const breakdown = {};
  claims.forEach(claim => {
    breakdown[claim.status] = (breakdown[claim.status] || 0) + 1;
  });
  return breakdown;
}

// Save new claim with geometry data
module.exports.saveClaimWithGeometry = async (req, res) => {
  try {
    const { geometry, claimData } = req.body;
    const userData = req.gs; // Assuming this is called by Gram Sabha officer
    
    if (!geometry || !geometry.coordinates) {
      return res.status(400).json({
        success: false,
        message: 'Geometry data is required'
      });
    }

    // Create new claim with geometry
    const newClaim = new Claim({
      ...claimData,
      geometry: geometry,
      gpCode: userData.gpCode,
      gramPanchayat: userData.gpName,
      tehsil: userData.districtId === 'PHN001' ? 'Phanda' : 'Berasia',
      district: 'Bhopal',
      status: 'Submitted'
    });

    await newClaim.save();

    res.status(201).json({
      success: true,
      message: 'Claim saved successfully with geometry data',
      claim: {
        id: newClaim._id,
        frapattaid: newClaim.frapattaid,
        geometry: newClaim.geometry
      }
    });

  } catch (error) {
    console.error('Save claim with geometry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while saving claim'
    });
  }
};
