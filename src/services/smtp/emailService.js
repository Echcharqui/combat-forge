require('dotenv').config();
const nodemailer = require("nodemailer");

const { getTheEmailTemplate } = require('./getTheEmailTemplate')

// Create a transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: "gmail", // Use Gmail as the service
    name: process.env.EMAIL_NAME,
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Your App Password or Gmail password
    },
});


// Step 4: Send the email
const sendEmail = async (to, emailType, data = null) => {
    // Define email options
    const mailOptions = {
        from: "astrosoft.digital.agency@gmail.com", // Sender address
        to: to, // Recipient address
        subject: emailType, // Email subject
        html: getTheEmailTemplate(emailType, data), // HTML body
    };

    // Return a new Promise to handle asynchronous email sending
    return new Promise((resolve, reject) => {
        // Use nodemailer's sendMail method to send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                // If there's an error, log it and reject the Promise
                console.error("Error sending email:", error);
                reject(error);
            } else {
                // If successful, log the info and resolve the Promise
                console.log("Email sent successfully:", info.response);
                resolve(info);
            }
        });
    });
}

module.exports = { sendEmail }