const jwt = require('jsonwebtoken');
const { Admin } = require('../model/admin.js');

const requireDistrict = async (req, res, next) => {
  try {
    // Check for token in cookies first, then Authorization header
    const token = req.cookies?.district_officer_token || req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.', success: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'district_officer') {
      return res.status(403).json({ message: 'Access denied. Invalid role.', success: false });
    }

    // Get officer data
    const officer = await Admin.findOne({ 
      districtId: decoded.districtId,
      role: 'district_officer'
    });

    if (!officer) {
      return res.status(401).json({ message: 'Invalid token. Officer not found.', success: false });
    }

    req.district = officer;
    next();
  } catch (error) {
    console.error('District auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token.', success: false });
  }
};

module.exports = { requireDistrict };
