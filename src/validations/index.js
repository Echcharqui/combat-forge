const { registerSchema } = require("./register/registerValidation")
const { confirmationEmailSchema } = require("./confirmationEmaila/confirmationEmaila")
const { loginSchema } = require("./login/loginValidation")
const { forgetPasswordSchema } = require("./forgetPassword/forgetPassword")
const { resetPasswordSchema } = require("./resetPassword/resetPassword")

module.exports = {
    registerSchema,
    confirmationEmailSchema,
    loginSchema,
    forgetPasswordSchema,
    resetPasswordSchema
};
