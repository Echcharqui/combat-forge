const Joi = require('joi');

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid Email Address',
        'any.required': 'Email is required'
    }),
    password: Joi.string()
        .min(8)
        .max(64)
        .required()
        .messages({
            'string.min': 'Minimum 8 characters required',
            'string.max': 'Password cannot exceed 64 characters',
            'any.required': 'Password is required'
        })
});

module.exports = { loginSchema };
