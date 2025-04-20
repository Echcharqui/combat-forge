require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User } = require('../models');
const { sendEmail } = require('../services/smtp/emailService');
const { addToBlacklist } = require('../services/redis/redisService');
const { tokenGenerator } = require('../util/tokensGenerator')
const { tokensCategories } = require('../helpers/tokenCategories')
const { emailTypes } = require('../helpers/emailTypes')

// Register new user
exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the email already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: {
                    message: 'Email already in use',
                },
            });
        }

        // Create new user instance
        const user = new User({ email, password });
        // Save to database
        await user.save();

        const accountValidationToken = await tokenGenerator(user, tokensCategories.accountConfirmation)

        let data = {
            token: accountValidationToken
        }

        await sendEmail(user.email, emailTypes.emailAccountConfirmation, data);

        // Return success response with user data (excluding password)
        return res.status(201).json({
            success: true,
            message: "User registered successfully"
        });

    } catch (err) {
        // Handle registration errors        
        return res.status(400).json({
            success: false,
            error: {
                message: "Registration failed",
                details: err.message || err,
            },
        });
    }
};

// account confirmation for new user
exports.accountVerification = async (req, res) => {
    try {
        // Extract token from Authorization header
        const token = req.header('Authorization')?.replace('Bearer ', '').trim();

        // Fetch user with `.lean()` to remove metadata
        const user = await User.findById(req.user._id).lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                error: { message: 'User not found' }
            });
        }

        // Check if the account is already verified
        if (user.isValidated) {
            return res.status(409).json({
                success: false,
                error: { message: 'Account is already verified' }
            });
        }

        // Update user validation status
        await User.findByIdAndUpdate(req.user._id, { isValidated: true });

        // Blacklist the token **AFTER** sending the response
        await addToBlacklist(token, Math.floor((jwt.decode(token).exp - Date.now() / 1000)));

        // Generate an access token
        const accessToken = await tokenGenerator(user, tokensCategories.access)

        // Generate a refresh token
        const refreshToken = await tokenGenerator(user, tokensCategories.refresh)

        // Send success response first
        return res.status(200).json({
            success: true,
            ...user,
            accessToken,
            refreshToken
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: {
                message: 'Server Error. Please try again later',
                details: err.message || err
            }
        });
    }
};

// resend confirmation email
exports.resendConfirmationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the email already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'this user dont exist',
                },
            });
        }

        // Check if the account is already verified
        if (existingUser.isValidated) {
            return res.status(409).json({
                success: false,
                error: { message: 'Account is already verified' }
            });
        }


        const accountValidationToken = await tokenGenerator(existingUser, tokensCategories.accountConfirmation)

        let data = {
            token: accountValidationToken
        }

        await sendEmail(existingUser.email, emailTypes.emailAccountConfirmation, data);

        // Return success response with user data (excluding password)
        return res.status(201).json({
            success: true,
            message: "A new confirmation email has been sent to your email address"
        });

    } catch (err) {
        // Handle registration errors        
        return res.status(400).json({
            success: false,
            error: {
                message: "Registration failed",
                details: err.message || err,
            },
        });
    }
};

// User login with email/password
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists by email, explicitly selecting the password
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                error: {
                    message: 'Login Failed. Please check your credentials and try again'
                }
            });
        }


        // Check if the account is already verified
        if (!user.isValidated) {
            return res.status(409).json({
                success: false,
                error: { message: 'Account is not yet verified' }
            });
        }

        // Compare the submitted password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: {
                    message: 'Login Failed. Please check your credentials and try again'
                }
            });
        }

        // Remove password from user object before sending response
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        // Generate an access token
        const accessToken = await tokenGenerator(user, tokensCategories.access)

        // Generate a refresh token
        const refreshToken = await tokenGenerator(user, tokensCategories.refresh)

        // Return success response with token
        return res.status(200).json({
            success: true,
            ...userWithoutPassword,
            accessToken,
            refreshToken
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            error: {
                message: "Login failed",
                details: err.message || err,
            },
        });
    }
};

// Initiate password reset process
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() })
        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    message: "User is not found",
                },
            });
        }
        // Generate password reset token
        const passwordResetToken = await tokenGenerator(user, tokensCategories.resetPassword);

        let data = {
            token: passwordResetToken
        }

        // Send email with reset token
        await sendEmail(user.email, emailTypes.emailResetPassword, data);

        return res.status(200).json({
            success: true,
            message: "A password reset email has been sent to your email address",
        });
    } catch (err) {
        // Handle password reset errors
        return res.status(400).json({
            success: false,
            error: {
                message: "Password reset failed",
                details: err.message || err,
            },
        });
    }
};

// Complete password reset with token
exports.resetPassword = async (req, res) => {
    try {
        // Extract token from Authorization header
        const token = req.header('Authorization')?.replace('Bearer ', '').trim();

        const { password } = req.body;

        // Hash the password
        const saltRounds = parseInt(process.env.SALTROUNDS);
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await User.findOneAndUpdate(
            { _id: req.user._id },
            { password: hashedPassword },
            { new: true }
        )

        await addToBlacklist(token, Math.floor((jwt.decode(token).exp - Date.now() / 1000)));

        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (err) {
        // Handle password reset errors
        return res.status(400).json({
            success: false,
            error: {
                message: "Password reset failed",
                details: err.message || err,
            },
        });
    }
};

// check user token validation 
exports.checkAccessToken = async (req, res) => {
    // Return success response with token
    return res.status(200).json({
        success: true,
        user: { ...req.user }
    });
}

// check user token validation 
exports.refreshAccessToken = async (req, res) => {
    try {
        const user = req.user;

        // Generate a new access token
        const newAccessToken = await tokenGenerator(user, tokensCategories.access);

        // Return the new access token
        return res.status(200).json({
            success: true,
            accessToken: newAccessToken
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: {
                message: 'Server Error. Please try again later'
            }
        });
    }
}

// Logout by blacklisting token
exports.logout = async (req, res) => {
    try {
        // Get the access token from the Authorization header
        const accessToken = req.header('Authorization').replace('Bearer ', '');

        // Get the refresh token from the custom header
        const refreshToken = req.header('x-refresh-token')?.replace('Bearer ', '');

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'token is required'
                }
            });
        }

        // Add tokens to blacklist
        await addToBlacklist(accessToken, Math.floor((jwt.decode(accessToken).exp - Date.now() / 1000)));
        await addToBlacklist(refreshToken, Math.floor((jwt.decode(refreshToken).exp - Date.now() / 1000)));

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });

    } catch (err) {
        // Handle logout errors
        return res.status(400).json({
            success: false,
            error: {
                message: "Logout failed",
                details: err.message || err,
            },
        });
    }
};