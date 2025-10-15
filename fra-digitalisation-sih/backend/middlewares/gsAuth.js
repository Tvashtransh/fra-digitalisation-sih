const jwt = require('jsonwebtoken');

module.exports.requireGS = (req, res, next) => {
  try {
    const token = req.cookies?.gs_token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fra_secret');
    if (!decoded || decoded.role !== 'GS') return res.status(401).json({ message: 'Unauthorized' });
    req.gs = decoded;
    return next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};


