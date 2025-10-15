const express = require('express');
const router = express.Router();
const { 
  blockOfficerLogin, 
  blockOfficerLogout,
  getBlockOfficerProfile, 
  getBlockOfficerClaims, 
  getBlockOfficerClaimDetails,
  approveClaim,
  rejectClaim,
  approveClaimBySubdivision,
  rejectClaimBySubdivision,
  forwardClaimToDistrict
} = require('../controller/blockOfficerAuthController');
const { getBlockOfficerStats, getVillageStats } = require('../controller/statisticsController');
const { requireBlockOfficer } = require('../middlewares/blockOfficerAuth');

// Block Officer authentication routes
router.post('/block-officer/login', blockOfficerLogin);
router.post('/block-officer/logout', blockOfficerLogout);

// Statistics routes
router.get('/block-officer/statistics', requireBlockOfficer, getBlockOfficerStats);
router.get('/block-officer/village-stats', requireBlockOfficer, getVillageStats);

// Block Officer profile routes
router.get('/block-officer/profile', requireBlockOfficer, getBlockOfficerProfile);

// Block Officer claims routes
router.get('/block-officer/claims', requireBlockOfficer, getBlockOfficerClaims);
router.get('/block-officer/claims/:claimId', requireBlockOfficer, getBlockOfficerClaimDetails);
router.post('/block-officer/claims/:claimId/approve', requireBlockOfficer, approveClaim);
router.post('/block-officer/claims/:claimId/reject', requireBlockOfficer, rejectClaim);

// Subdivision Officer specific routes
router.post('/block-officer/claims/:claimId/approve', requireBlockOfficer, approveClaimBySubdivision);
router.post('/block-officer/claims/:claimId/reject', requireBlockOfficer, rejectClaimBySubdivision);
router.post('/block-officer/claims/:claimId/forward-to-district', requireBlockOfficer, forwardClaimToDistrict);

module.exports = router;
