require('dotenv').config();
const { createClient } = require('redis');

const clientRedis = createClient({
    socket: {
        host: process.env.REDIS_IP, // Redis host (use 'localhost' if local)
        port: process.env.REDIS_PORT, // Redis port
    }
});

const connectRedis = async () => {
    try {
        await clientRedis.connect();
        console.log('Redis connected');
    } catch (err) {
        console.error('Redis connection error:', err);
        throw err;
    }
};

clientRedis.on('error', (err) => {
    console.error('Redis error:', err);
    process.exit(1);
});

// Add token to blacklist with proper key format and TTL
const addToBlacklist = async (token, expiresIn) => {
    try {
        await clientRedis.setEx(`blacklisted:${token}`, expiresIn, 'blacklisted');
    } catch (err) {
        console.error('Error adding token to blacklist:', err);
        throw new Error('Failed to add token to blacklist');
    }
};

// Check if a token is blacklisted
const isBlacklisted = async (token) => {
    try {
        const result = await clientRedis.get(`blacklisted:${token}`);
        return result === 'blacklisted';
    } catch (err) {
        console.error('Error checking blacklist:', err);
        throw new Error('Failed to check if token is blacklisted');
    }
};

module.exports = { connectRedis, addToBlacklist, isBlacklisted };
