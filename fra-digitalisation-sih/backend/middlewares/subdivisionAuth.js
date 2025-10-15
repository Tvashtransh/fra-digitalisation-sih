const jwt = require('jsonwebtoken');
const { Admin } = require('../model/admin.js');

const requireSubdivision = async (req, res, next) => {
  try {
    // Check for token in cookies first, then Authorization header
    let token = req.cookies?.subdivision_token;
    if (!token) {
      token = req.header('Authorization')?.replace('Bearer ', '');
    }
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.', success: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'SDLCOfficer') {
      return res.status(403).json({ message: 'Access denied. Invalid role.', success: false });
    }

    // Get officer data
    const officer = await Admin.findOne({ 
      subdivisionId: decoded.subdivisionId,
      role: 'SDLCOfficer'
    });

    if (!officer) {
      return res.status(401).json({ message: 'Invalid token. Officer not found.', success: false });
    }

    req.subdivision = officer;
    next();
  } catch (error) {
    console.error('Subdivision auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token.', success: false });
  }
};

module.exports = { requireSubdivision };
