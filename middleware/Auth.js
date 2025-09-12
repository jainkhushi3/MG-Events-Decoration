const jwt = require('jsonwebtoken');
const { pool } = require('../db/connectDB');

// Middleware to verify JWT and attach user data
const Auth = async (req, res, next) => {
    try {
        // Disable caching for auth-sensitive pages
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        // 1. Get token from cookies
        const token = req.cookies.jwt;
        if (!token) {
            return res.redirect('/login');
        }

        // 2. Verify token (throws error if invalid)
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'HelloWorld.....');

        // 3. Fetch user from DB (parameterized query)
        const [user] = await pool.query('SELECT * FROM users WHERE user_id = ?', [decoded.userId]);
        if (!user || user.length === 0) {
            return res.redirect('/login');
        }

        // 4. Attach user data to request
        req.user = user[0];
        next();

    } catch (error) {
        console.error('Auth Error:', error);
        res.clearCookie('jwt');
        return res.redirect('/login');
    }
};

module.exports = Auth