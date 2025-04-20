const apiKeyMiddleware = (req, res, next) => {
    const clientApiKey = req.header('x-api-key'); // Header for API key

    if (!clientApiKey) {
        return res.status(403).json({
            statusCode: 403,
            error: {
                message: 'Forbidden. API key is missing'
            }
        });
    }

    if (clientApiKey !== process.env.API_KEY) {
        return res.status(403).json({
            statusCode: 403,
            error: {
                message: 'Forbidden. Invalid API key'
            }
        });
    }

    next();
};

module.exports = apiKeyMiddleware;
