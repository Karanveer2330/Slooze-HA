const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  const jwtToken = req.header("token") || req.header("jwt_token");

  if (!jwtToken) {
    return res.status(403).json({ error: "Authorization denied. No token provided." });
  }

  try {
    const verify = jwt.verify(jwtToken, process.env.jwtSecret || "fallback_secret");
    req.user = verify;
    next();
  } catch (err) {
    res.status(403).json({ error: "Token is not valid. Please login again." });
  }
};
