const inputsValidation = require("./inputsValidation/inputValidationMiddleware")
const limiter = require("./rateLimter/rateLimiterMiddleware")
const apiKeyMiddleware = require("./apiKey/apiKeyMiddleware")
const verifyAccountConfirmationToken = require("./verifyAccountConfirmationToken/verifyAccountConfirmationToken")
const verifyAccessToken = require("./verifyAccessToken/verifyAccessToken")
const verifyRefreshToken = require("./verifyRefreshToken/verifyRefreshToken")
const verifyResetPasswordToken = require("./verifyResetPasswordToken/verifyResetPasswordToken")

module.exports = {
    apiKeyMiddleware,
    inputsValidation,
    limiter,
    verifyAccountConfirmationToken,
    verifyAccessToken,
    verifyRefreshToken,
    verifyResetPasswordToken
};
