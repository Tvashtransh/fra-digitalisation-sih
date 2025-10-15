const mongoose = require('mongoose');
const Claim = require('../model/claim.js');
const Claimant = require('../model/claimant.js');

// Get real statistics for community users
module.exports.getCommunityStats = async (req, res) => {
  try {
    const claimantId = req.user.id;
    
    // Get claims submitted by this claimant
    const totalSubmitted = await Claim.countDocuments({ claimant: claimantId });
    
    // Get claims by status for this claimant
    const statusCounts = await Claim.aggregate([
      { $match: { claimant: mongoose.Types.ObjectId(claimantId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const stats = {
      totalSubmitted: totalSubmitted,
      submitted: totalSubmitted,
      verifiedByGramSabha: 0,
      reviewedAtBlock: 0,
      districtReview: 0,
      finalApproval: 0,
      rejected: 0
    };
    
    // Map status counts to our statistics
    statusCounts.forEach(item => {
      switch(item._id) {
        case 'Submitted':
          stats.submitted = item.count;
          break;
        case 'MappedByGramSabha':
        case 'ForwardedToSubdivision':
          stats.verifiedByGramSabha += item.count;
          break;
        case 'UnderSubdivisionReview':
        case 'ApprovedBySubdivision':
          stats.reviewedAtBlock += item.count;
          break;
        case 'ForwardedToDistrict':
        case 'UnderDistrictReview':
          stats.districtReview += item.count;
          break;
        case 'FinalApproved':
          stats.finalApproval += item.count;
          break;
      }
    });
    
    res.status(200).json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error('Get community stats error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Get real statistics for Gram Sabha officers
module.exports.getGramSabhaStats = async (req, res) => {
  try {
    const officerData = req.gs;
    const gpCode = officerData.gpCode;
    
    // Get claims in this Gram Sabha's jurisdiction
    const totalSubmitted = await Claim.countDocuments({ gpCode: gpCode });
    
    // Get claims by status for this Gram Sabha
    const statusCounts = await Claim.aggregate([
      { $match: { gpCode: gpCode } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const stats = {
      totalSubmitted: totalSubmitted,
      submitted: 0,
      verifiedByGramSabha: 0,
      reviewedAtBlock: 0,
      districtReview: 0,
      finalApproval: 0,
      rejected: 0
    };
    
    // Map status counts to our statistics
    statusCounts.forEach(item => {
      switch(item._id) {
        case 'Submitted':
          stats.submitted = item.count;
          break;
        case 'MappedByGramSabha':
        case 'ForwardedToSubdivision':
          stats.verifiedByGramSabha += item.count;
          break;
        case 'UnderSubdivisionReview':
        case 'ApprovedBySubdivision':
          stats.reviewedAtBlock += item.count;
          break;
        case 'ForwardedToDistrict':
        case 'UnderDistrictReview':
          stats.districtReview += item.count;
          break;
        case 'FinalApproved':
          stats.finalApproval += item.count;
          break;
        case 'FinalRejected':
        case 'RejectedBySubdivision':
        case 'RejectedByDistrict':
          stats.rejected += item.count;
          break;
      }
    });
    
    res.status(200).json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error('Get Gram Sabha stats error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Get real statistics for Block/Subdivision officers
module.exports.getBlockOfficerStats = async (req, res) => {
  try {
    const officerData = req.blockOfficer;
    
    // Determine subdivision filter based on officer's districtId
    let subdivisionFilter = {};
    
    if (officerData.districtId === 'PHN001') {
      subdivisionFilter = { gpCode: { $regex: '^GS-PHN-', $options: 'i' } };
    } else if (officerData.districtId === 'BRS001') {
      subdivisionFilter = { gpCode: { $regex: '^GS-BRS-', $options: 'i' } };
    }
    
    // Get total claims in this subdivision
    const totalSubmitted = await Claim.countDocuments(subdivisionFilter);
    
    // Get claims by status for this subdivision
    const statusCounts = await Claim.aggregate([
      { $match: subdivisionFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const stats = {
      totalSubmitted: totalSubmitted,
      submitted: 0,
      verifiedByGramSabha: 0,
      reviewedAtBlock: 0,
      districtReview: 0,
      finalApproval: 0,
      rejected: 0
    };
    
    // Map status counts to our statistics
    statusCounts.forEach(item => {
      switch(item._id) {
        case 'Submitted':
          stats.submitted = item.count;
          break;
        case 'MappedByGramSabha':
        case 'ForwardedToSubdivision':
          stats.verifiedByGramSabha += item.count;
          break;
        case 'UnderSubdivisionReview':
        case 'ApprovedBySubdivision':
          stats.reviewedAtBlock += item.count;
          break;
        case 'ForwardedToDistrict':
        case 'UnderDistrictReview':
          stats.districtReview += item.count;
          break;
        case 'FinalApproved':
          stats.finalApproval += item.count;
          break;
        case 'FinalRejected':
        case 'RejectedBySubdivision':
        case 'RejectedByDistrict':
          stats.rejected += item.count;
          break;
      }
    });
    
    res.status(200).json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error('Get block officer stats error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Get real statistics for District officers
module.exports.getDistrictStats = async (req, res) => {
  try {
    const officerData = req.district;
    
    // Get all claims in the district
    const totalSubmitted = await Claim.countDocuments({});
    
    // Get claims by status
    const statusCounts = await Claim.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const stats = {
      totalSubmitted: totalSubmitted,
      submitted: 0,
      verifiedByGramSabha: 0,
      reviewedAtBlock: 0,
      districtReview: 0,
      finalApproval: 0,
      rejected: 0
    };
    
    // Map status counts to our statistics
    statusCounts.forEach(item => {
      switch(item._id) {
        case 'Submitted':
          stats.submitted = item.count;
          break;
        case 'MappedByGramSabha':
        case 'ForwardedToSubdivision':
          stats.verifiedByGramSabha += item.count;
          break;
        case 'UnderSubdivisionReview':
        case 'ApprovedBySubdivision':
          stats.reviewedAtBlock += item.count;
          break;
        case 'ForwardedToDistrict':
        case 'UnderDistrictReview':
          stats.districtReview += item.count;
          break;
        case 'FinalApproved':
          stats.finalApproval += item.count;
          break;
        case 'FinalRejected':
        case 'RejectedBySubdivision':
        case 'RejectedByDistrict':
          stats.rejected += item.count;
          break;
      }
    });
    
    res.status(200).json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error('Get district stats error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Get real statistics for Subdivision officers
module.exports.getSubdivisionStats = async (req, res) => {
  try {
    const officerData = req.subdivision;
    
    // Determine subdivision filter based on officer's subdivisionId
    let subdivisionFilter = {};
    
    if (officerData.subdivisionId === 'PHN001') {
      subdivisionFilter = { gpCode: { $regex: '^GS-PHN-', $options: 'i' } };
    } else if (officerData.subdivisionId === 'BRS001') {
      subdivisionFilter = { gpCode: { $regex: '^GS-BRS-', $options: 'i' } };
    }
    
    // Get total claims in this subdivision
    const totalSubmitted = await Claim.countDocuments(subdivisionFilter);
    
    // Get claims by status for this subdivision
    const statusCounts = await Claim.aggregate([
      { $match: subdivisionFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const stats = {
      totalSubmitted: totalSubmitted,
      submitted: 0,
      verifiedByGramSabha: 0,
      reviewedAtBlock: 0,
      districtReview: 0,
      finalApproval: 0,
      rejected: 0
    };
    
    // Map status counts to our statistics
    statusCounts.forEach(item => {
      switch(item._id) {
        case 'Submitted':
          stats.submitted = item.count;
          break;
        case 'MappedByGramSabha':
        case 'ForwardedToSubdivision':
          stats.verifiedByGramSabha += item.count;
          break;
        case 'UnderSubdivisionReview':
        case 'ApprovedBySubdivision':
          stats.reviewedAtBlock += item.count;
          break;
        case 'ForwardedToDistrict':
        case 'UnderDistrictReview':
          stats.districtReview += item.count;
          break;
        case 'FinalApproved':
          stats.finalApproval += item.count;
          break;
        case 'FinalRejected':
        case 'RejectedBySubdivision':
        case 'RejectedByDistrict':
          stats.rejected += item.count;
          break;
      }
    });
    
    res.status(200).json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error('Get subdivision stats error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Get village statistics for Block Officer
module.exports.getVillageStats = async (req, res) => {
  try {
    const subdivisionId = req.blockOfficer.districtId; // This should be subdivision ID
    
    // Get all villages in this subdivision with their claim statistics
    const villageStats = await Claim.aggregate([
      { 
        $match: { 
          $or: [
            { 'applicantDetails.village': { $exists: true } },
            { 'claimant.village': { $exists: true } }
          ]
        } 
      },
      {
        $group: {
          _id: {
            $cond: [
              { $ne: ['$applicantDetails.village', null] },
              '$applicantDetails.village',
              '$claimant.village'
            ]
          },
          totalClaims: { $sum: 1 },
          submitted: {
            $sum: { $cond: [{ $eq: ['$status', 'Submitted'] }, 1, 0] }
          },
          approved: {
            $sum: { $cond: [{ $eq: ['$status', 'FinalApproved'] }, 1, 0] }
          },
          rejected: {
            $sum: { $cond: [{ $eq: ['$status', 'FinalRejected'] }, 1, 0] }
          },
          pending: {
            $sum: { 
              $cond: [
                { 
                  $in: ['$status', [
                    'MappedByGramSabha', 
                    'ForwardedToSubdivision', 
                    'UnderSubdivisionReview', 
                    'ApprovedBySubdivision',
                    'ForwardedToDistrict',
                    'UnderDistrictReview'
                  ]] 
                }, 
                1, 
                0
              ] 
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Get total villages count
    const totalVillages = villageStats.length;
    const activeVillages = villageStats.filter(v => v.totalClaims > 0).length;
    
    res.json({
      success: true,
      stats: {
        totalVillages,
        activeVillages,
        inactiveVillages: totalVillages - activeVillages,
        villages: villageStats
      }
    });
  } catch (error) {
    console.error('Error fetching village statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching village statistics'
    });
  }
};
