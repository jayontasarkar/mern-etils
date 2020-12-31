const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const privateKey = process.env.jWT_PRIVATE_KEY || 'etils_jwtPrivateKey';
    const decoded = jwt.verify(token, privateKey);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send('Invalid token provided.');
  }
};
