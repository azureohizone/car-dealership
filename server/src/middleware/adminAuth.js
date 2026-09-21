/**
 * Simple Admin Authentication Middleware
 * Checks for x-admin-key header and validates against ADMIN_KEY env variable.
 * Protects write endpoints (POST, PUT, DELETE) for vehicle management.
 */
module.exports = function adminAuth(req, res, next) {
  const adminKey = req.headers['x-admin-key'];

  if (!adminKey) {
    return res.status(401).json({
      success: false,
      message: 'Admin key is required. Provide it via x-admin-key header.'
    });
  }

  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({
      success: false,
      message: 'Invalid admin key.'
    });
  }

  next();
};
