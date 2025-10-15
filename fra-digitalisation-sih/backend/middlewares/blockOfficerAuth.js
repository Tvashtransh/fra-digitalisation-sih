const jwt = require('jsonwebtoken');

module.exports.requireBlockOfficer = (req, res, next) => {
  try {
    // Check for token in cookies first, then Authorization header
    let token = req.cookies?.block_officer_token;
    if (!token) {
      token = req.headers.authorization?.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ message: 'Access token required', success: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'block_officer') {
      return res.status(403).json({ message: 'Access denied. Block Officer role required.', success: false });
    }

    req.blockOfficer = decoded;
    next();
  } catch (error) {
    console.error('Block Officer auth error:', error);
    return res.status(401).json({ message: 'Invalid token', success: false });
  }
};
