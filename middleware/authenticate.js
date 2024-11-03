const jwt = require('jsonwebtoken');
const secretKey = 'abcdeghijk';
const authenticate = (req, res, next) => {
    // console.log('Request Headers:', req.headers);
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
        return res.status(403).json({ message: "Token is required" });
    }
  
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        console.log("Token verified:", decoded);
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
  };
  
  module.exports = authenticate;

