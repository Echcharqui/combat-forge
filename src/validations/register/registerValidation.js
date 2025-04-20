const Joi = require('joi');

const registerSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid Email Address',
        'any.required': 'Email is required'
    }),
    password: Joi.string()
        .min(8)
        .max(64) // Adjust this max length as needed.
        .required()
        .messages({
            'string.min': 'Minimum 8 characters required',
            'any.required': 'Password is required'
        }),
    passwordConfirmation: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match',
        'any.required': 'Confirm password is required'
    })
}).with('password', 'passwordConfirmation'); // Ensures both password and confirmPassword are present

module.exports = { registerSchema };
