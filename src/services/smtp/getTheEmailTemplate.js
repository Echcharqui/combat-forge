// Import email types enum and template functions
const { emailTypes } = require('../../helpers/emailTypes')
const templates = require('./templates')

// Function to get the appropriate email template based on type
const getTheEmailTemplate = (type, data) => {
    switch (type) {
        case emailTypes.emailAccountConfirmation:
            // Return account validation email template with provided data
            return templates.accountValididationEmailTemplate(data)

        case emailTypes.emailResetPassword:
            // Return password reset email template with provided data
            return templates.resetPasswordEmailTemplate(data)
        default:
            // Return null if no matching type is found
            return null
    }
}

// Export the function for use in other modules
module.exports = { getTheEmailTemplate }