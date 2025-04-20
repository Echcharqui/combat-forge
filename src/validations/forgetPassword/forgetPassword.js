const Joi = require('joi');

const forgetPasswordSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid Email Address',
        'any.required': 'Email is required'
    })
});

module.exports = { forgetPasswordSchema };
