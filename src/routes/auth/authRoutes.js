// Import required modules
const express = require('express');
const router = express.Router();

// Import middlewares and controllers
const {
    verifyAccountConfirmationToken,
    verifyAccessToken,
    verifyRefreshToken,
    verifyResetPasswordToken,
    inputsValidation,
    limiter
} = require("../../middlewares")

const authController = require('../../controllers/authController');
const { registerSchema, confirmationEmailSchema, loginSchema, forgetPasswordSchema, resetPasswordSchema } = require("../../validations")

// Route for user registration
// Uses rate limiter and input validation middleware
router.post('/register', limiter, inputsValidation(registerSchema), authController.register);

// Route for account verification
router.put('/account-verification', limiter, verifyAccountConfirmationToken, authController.accountVerification);

// Route for account verification
router.post('/resend-new-confirmation-email', limiter, inputsValidation(confirmationEmailSchema), authController.resendConfirmationEmail);

// Route for user login
router.post('/login', limiter, inputsValidation(loginSchema), authController.login);

// Route for password recovery request
router.post('/forgot-password', limiter, inputsValidation(forgetPasswordSchema), authController.forgotPassword);

// Route for password reset
router.put('/reset-password', limiter, verifyResetPasswordToken, inputsValidation(resetPasswordSchema), authController.resetPassword);

// Route for check the access token
router.get('/check-access-token', verifyAccessToken, authController.checkAccessToken);

// Route for refreshing the access token
router.post('/refresh-access-token', verifyRefreshToken, authController.refreshAccessToken);

// Route for user logout
router.post('/logout', verifyAccessToken, authController.logout);

// Export the router for use in the application
module.exports = router;