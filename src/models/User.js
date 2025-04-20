// Import required modules
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the user schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,  // Email is required
        unique: true     // Email must be unique
    },
    password: {
        type: String,
        required: true,  // Password is required
        select: false    // Password won't be returned by default in queries
    },
    isValidated: {
        type: Boolean,
        required: true,  // Validation status is required
        default: false   // Default validation status is false
    }
}, {
    timestamps: true  // This automatically adds createdAt and updatedAt fields
});

// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified
    if (this.isModified('password')) {
        // Get salt rounds from environment or use default (10)
        const saltRounds = parseInt(process.env.SALTROUNDS) || 10;
        // Hash the password using bcrypt
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    // Proceed to the next middleware
    next();
});

// Export the User model
module.exports = mongoose.model('User', userSchema);