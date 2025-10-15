const express = require('express');
const router = express.Router();
const { getMapData, saveClaimWithGeometry } = require('../controller/mapController');

// Middleware imports for different user types
const { requireGS } = require('../middlewares/gsAuth');
const { requireBlockOfficer } = require('../middlewares/blockOfficerAuth');
const { requireDistrict } = require('../middlewares/districtAuth');
const { requireAuth } = require('../middlewares/ClaimantAuth');

// Get map data - accessible by all authenticated users
router.get('/map-data', (req, res, next) => {
  // Try to authenticate with different user types
  const authMiddlewares = [requireGS, requireBlockOfficer, requireDistrict, requireAuth];
  
  let currentIndex = 0;
  
  const tryNextAuth = (err) => {
    if (currentIndex < authMiddlewares.length) {
      const middleware = authMiddlewares[currentIndex++];
      middleware(req, res, (authErr) => {
        if (authErr) {
          tryNextAuth(authErr);
        } else {
          next();
        }
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
  };
  
  tryNextAuth();
}, getMapData);

// Save claim with geometry - only for Gram Sabha officers
router.post('/save-claim-geometry', requireGS, saveClaimWithGeometry);

module.exports = router;
