const Joi = require('joi');

const confirmationEmailSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid Email Address',
        'any.required': 'Email is required'
    })
});

module.exports = { confirmationEmailSchema };
