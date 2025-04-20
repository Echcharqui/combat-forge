const jwt = require('jsonwebtoken')

// requiring the tokens categorys
const { tokensCategories } = require('../helpers/tokenCategories')

const tokenGenerator = async (user, catagory) => {
    switch (catagory) {
        case tokensCategories.access: {
            const token = jwt.sign(
                {
                    userId: user._id
                },
                process.env.JWT_AUTH_SECRET,
                {
                    expiresIn: process.env.AUTH_TOKEN_EXPIRES_IN
                }
            )
            return token
        }

        case tokensCategories.refresh: {
            const token = jwt.sign(
                {
                    userId: user._id
                },
                process.env.JWT_REFRESH_SECRET,
                {
                    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
                }
            )
            return token
        }

        case tokensCategories.accountConfirmation: {
            const token = jwt.sign(
                {
                    userId: user._id
                },
                process.env.JWT_ACCOUNT_CONFIRMATION_SECRET,
                {
                    expiresIn: process.env.ACCOUN_CONFIRMATION_TOKEN_EXPIRES_IN
                }
            )
            return token
        }

        case tokensCategories.resetPassword: {
            const token = jwt.sign(
                {
                    userId: user._id
                },
                process.env.JWT_PASSWORD_RESET_SECRET,
                {
                    expiresIn: process.env.RESET_PASSWORD_TOKEN_EXPIRES_IN
                }
            )
            return token
        }
        default:
            break
    }
}

module.exports = { tokenGenerator }
