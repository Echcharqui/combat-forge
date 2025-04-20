exports.resetPasswordEmailTemplate = (data) => {
    return `
   <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        body {
            font-family: 'Inter', 'Roboto', 'Open Sans', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f7f7f7;
            color: #333333;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .header {
            text-align: center;
            padding: 20px 0;
        }

        .header img {
            max-width: 150px;
        }

        .content {
            padding: 20px;
            text-align: center;
        }

        .content h1 {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 20px;
            color: #333333;
        }

        .content p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 20px;
            color: #555555;
        }

        .cta-button {
            display: inline-block;
            padding: 12px 24px;
            font-size: 16px;
            font-weight: 600;
            color: #ffffff;
            background-color: #007bff;
            border-radius: 4px;
            text-decoration: none;
            margin-bottom: 20px;
        }

        .footer {
            text-align: center;
            padding: 20px;
            font-size: 14px;
            color: #999999;
        }

        .footer a {
            color: #007bff;
            text-decoration: none;
        }

        .note {
            font-size: 14px;
            color: #777777;
            margin-top: 20px;
        }
    </style>
</head>

<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <img src="https://yourlogo.com/logo.png" alt="Company Logo">
        </div>

        <!-- Content -->
        <div class="content">
            <h1>Reset Your Password</h1>
            <p>We received a request to reset your password. Click the button below to securely reset it:</p>
            <a href="${process.env.END_USER_WEB_DOMAIN_DEV}/reset-password?token=${data.token}" class="cta-button">Reset Password</a>
            <p class="note">If you didn't request this, you can safely ignore this email. Your account is still secure.
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Need help? <a href="mailto:support@yourcompany.com">Contact our support team</a>.</p>
            <p>&copy; 2023 Your Company. All rights reserved.</p>
        </div>
    </div>
</body>

</html>
`
}