const jwt = require('jsonwebtoken');
const { isBlacklisted } = require('../../services/redis/redisService');
const { User } = require('../../models');

const verifyAccountConfirmationToken = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: { message: 'Authentication failed. Token is missing' }
            });
        }

        const token = authHeader.replace('Bearer ', '').trim(); // Remove 'Bearer ' prefix

        // Check if token is blacklisted
        if (await isBlacklisted(token)) {
            return res.status(401).json({
                success: false,
                error: { message: 'Authentication failed. Token has been blacklisted' }
            });
        }

        // Verify the token
        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_ACCOUNT_CONFIRMATION_SECRET);
        } catch (error) {
            return res.status(401).json({
                success: false,
                error: { message: 'Operation failed. Token is invalid or expired' }
            });
        }

        // Fetch user from database
        const user = await User.findById(payload.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                error: { message: 'Operation failed. User not found' }
            });
        }

        // Convert Mongoose document to plain object and remove sensitive data
        const userObject = user.toObject();
        delete userObject.password;

        // Attach clean user info to request for further processing
        req.user = userObject;

        next(); // Move to the next middleware or controller
    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({
            success: false,
            error: { message: 'Server Error. Please try again later' }
        });
    }
};

module.exports = verifyAccountConfirmationToken;
