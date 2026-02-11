export const forgetpasswordLink = ({ resetLink }) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #f4f7f9; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background: #4f46e5; padding: 30px; text-align: center; }
        .content { padding: 40px 30px; text-align: center; color: #374151; }
        .btn { display: inline-block; padding: 14px 28px; background-color: #4f46e5; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 25px 0; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; }
        .link-text { word-break: break-all; color: #6366f1; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="color: white; margin: 0; font-size: 24px;">Secure Reset</h1>
        </div>
        <div class="content">
            <h2 style="font-size: 22px; color: #111827;">Password Reset Request</h2>
            <p style="font-size: 16px; line-height: 1.6;">Hello, <br> We received a request to reset your password. Click the button below to proceed.</p>
            <a href="${resetLink}" class="btn">Reset My Password</a>
            <p style="font-size: 14px; color: #6b7280;">This link will expire in <strong>1 hour</strong>.</p>
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="font-size: 12px; color: #9ca3af;">Link breakdown (if button fails):</p>
            <p class="link-text">${resetLink}</p>
        </div>
        <div class="footer">
            &copy; ${new Date().getFullYear()} YourAppName. All rights reserved.
        </div>
    </div>
</body>
</html>`;
};