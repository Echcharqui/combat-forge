// Load environment variables from .env file
require('dotenv').config();

// Import required packages
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Import database and Redis connection utilities
const connectDB = require('./src/database');
const { connectRedis } = require('./src/services/redis/redisService');

// Import route handlers
const authRoutes = require('./src/routes/auth/authRoutes');
const docRouters = require('./src/routes/doc/docRoutes');

// Import middleware
const { apiKeyMiddleware } = require("./src/middlewares")

// Initialize database and Redis connections
connectDB();
connectRedis();

// Create Express application
const app = express();

// Configure CORS options based on environment
const corsOptions = {
    origin: process.env.MODE === "dev" ? process.env.END_USER_WEB_DOMAIN_DEV : process.env.END_USER_WEB_DOMAIN_PROD,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Apply middleware
app.use(express.json()) // Parse JSON request bodies
app.use(cors(corsOptions)) // Enable CORS with configured options
app.use(morgan(process.env.MODE)); // HTTP request logger

// Register routes
app.use('/api/v1/documentation', docRouters); // Documentation routes
app.use('/api/v1/auth', apiKeyMiddleware, authRoutes); // Authentication routes with API key middleware

// 404 handler - catches requests to undefined routes
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Resource not found'
    });
});

// General error handler - catches all errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong'
    });
});

// Set server port from environment or default to 5000
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});