const jwt =  require("jsonwebtoken");

 const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token;  // read from cookies

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }

      req.user = decoded; // decoded contains { id: ... }
      next();
      console.log(req.user);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = verifyToken;
