const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(user_id, user_role = 'member', country = 'India') {
  const payload = {
    user: user_id,
    role: user_role,
    country: country
  };

  return jwt.sign(payload, process.env.jwtSecret || "fallback_secret", { expiresIn: "24hr" });
}

module.exports = jwtGenerator;
