const express = require('express');
const router = express.Router();
const { 
  districtLogin, 
  districtLogout,
  getDistrictProfile, 
  getDistrictClaims, 
  getDistrictClaimDetails,
  reviewClaim,
  finalApproveClaim,
  finalRejectClaim
} = require('../controller/districtAuthController');
const { getDistrictStats } = require('../controller/statisticsController');
const { requireDistrict } = require('../middlewares/districtAuth');

// District Officer authentication
router.post('/district/login', districtLogin);
router.post('/district/logout', districtLogout);

// Statistics routes
router.get('/district/statistics', requireDistrict, getDistrictStats);

// District Officer profile routes
router.get('/district/profile', requireDistrict, getDistrictProfile);

// District Officer claims routes
router.get('/district/claims', requireDistrict, getDistrictClaims);
router.get('/district/claims/:claimId', requireDistrict, getDistrictClaimDetails);

// District Officer actions
router.post('/district/claims/:claimId/review', requireDistrict, reviewClaim);
router.post('/district/claims/:claimId/approve', requireDistrict, finalApproveClaim);
router.post('/district/claims/:claimId/reject', requireDistrict, finalRejectClaim);

module.exports = router;
