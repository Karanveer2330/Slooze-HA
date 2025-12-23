const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    // This middleware assumes authorization has already run
    if (!req.user) {
      console.error('checkRole: req.user is not set');
      return res.status(403).json({ error: "Authorization denied. Please authenticate first." });
    }

    const userRole = (req.user.role || 'member').toLowerCase();
    const allowedRolesLower = allowedRoles.map(r => r.toLowerCase());
    
    console.log('checkRole:', { userRole, allowedRoles: allowedRolesLower, reqUser: req.user });
    
    if (!allowedRolesLower.includes(userRole)) {
      return res.status(403).json({
        error: "Access denied. Insufficient permissions.",
        required: allowedRoles,
        yourRole: userRole,
        debug: { user: req.user }
      });
    }

    next();
  };
};

const checkCountry = (req, res, next) => {
  if (!req.user || !req.user.country) {
    return res.status(403).json("Country information not available");
  }

  const userCountry = req.user.country;
  const requestedCountry = req.body.country || req.query.country;

  if (requestedCountry && requestedCountry !== userCountry) {
    return res.status(403).json("Access denied. Country restriction.");
  }

  next();
};

module.exports = { checkRole, checkCountry };


    // This middleware assumes authorization has already run
    if (!req.user) {
      console.error('checkRole: req.user is not set');
      return res.status(403).json({ error: "Authorization denied. Please authenticate first." });
    }

    const userRole = (req.user.role || 'member').toLowerCase();
    const allowedRolesLower = allowedRoles.map(r => r.toLowerCase());
    
    console.log('checkRole:', { userRole, allowedRoles: allowedRolesLower, reqUser: req.user });
    
    if (!allowedRolesLower.includes(userRole)) {
      return res.status(403).json({
        error: "Access denied. Insufficient permissions.",
        required: allowedRoles,
        yourRole: userRole,
        debug: { user: req.user }
      });
    }

    next();
  };
};

const checkCountry = (req, res, next) => {
  if (!req.user || !req.user.country) {
    return res.status(403).json("Country information not available");
  }

  const userCountry = req.user.country;
  const requestedCountry = req.body.country || req.query.country;

  if (requestedCountry && requestedCountry !== userCountry) {
    return res.status(403).json("Access denied. Country restriction.");
  }

  next();
};

module.exports = { checkRole, checkCountry };

