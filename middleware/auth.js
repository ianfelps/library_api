const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// middleware para verificar o token
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
        
    } catch (error) {
        res.status(401).json({ error: 'Invalid token.' });
    }
};

module.exports = {JWT_SECRET, authMiddleware};