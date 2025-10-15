const express = require('express');
const router = express.Router();
const { gsLogin, gsLogout, getGSProfile, updateGSProfile, getGSClaims, getGSClaimDetails, saveClaimMap, forwardClaimToSubdivision } = require('../controller/gsAuthController');
const { getGramSabhaStats } = require('../controller/statisticsController');
const { requireGS } = require('../middlewares/gsAuth');

router.post('/gs/login', gsLogin);
router.post('/gs/logout', gsLogout);

// Statistics routes
router.get('/gs/statistics', requireGS, getGramSabhaStats);

// Gram Sabha profile routes
router.get('/gs/profile', requireGS, getGSProfile);
router.put('/gs/profile', requireGS, updateGSProfile);

// Gram Sabha claims routes
router.get('/gs/claims', requireGS, getGSClaims);
router.get('/gs/claims/:claimId', requireGS, getGSClaimDetails);
router.post('/gs/claims/:claimId/map', requireGS, saveClaimMap);
router.post('/gs/claims/:claimId/forward', requireGS, forwardClaimToSubdivision);

module.exports = router;


