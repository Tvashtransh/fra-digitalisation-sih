const express = require('express');
const router = express.Router();
const { 
  subdivisionLogin, 
  subdivisionLogout,
  getSubdivisionProfile, 
  getSubdivisionClaims, 
  getSubdivisionClaimDetails,
  reviewClaim,
  approveAndForwardToDistrict,
  rejectClaim
} = require('../controller/subdivisionAuthController');
const { getSubdivisionStats } = require('../controller/statisticsController');
const { requireSubdivision } = require('../middlewares/subdivisionAuth');

// Subdivision Officer authentication
router.post('/subdivision/login', subdivisionLogin);
router.post('/subdivision/logout', subdivisionLogout);

// Statistics routes
router.get('/subdivision/statistics', requireSubdivision, getSubdivisionStats);

// Subdivision Officer profile routes
router.get('/subdivision/profile', requireSubdivision, getSubdivisionProfile);

// Subdivision Officer claims routes (view only)
router.get('/subdivision/claims', requireSubdivision, getSubdivisionClaims);
router.get('/subdivision/claims/:claimId', requireSubdivision, getSubdivisionClaimDetails);

// Subdivision Officer actions
router.post('/subdivision/claims/:claimId/review', requireSubdivision, reviewClaim);
router.post('/subdivision/claims/:claimId/approve', requireSubdivision, approveAndForwardToDistrict);
router.post('/subdivision/claims/:claimId/reject', requireSubdivision, rejectClaim);

module.exports = router;
