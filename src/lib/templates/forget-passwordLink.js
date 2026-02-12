export const forgetpasswordLink = ({ resetLink }) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        body { 
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            background-color: #f8fafc; 
            margin: 0; 
            padding: 0; 
            -webkit-font-smoothing: antialiased;
        }
        .wrapper { 
            width: 100%; 
            table-layout: fixed; 
            background-color: #f8fafc; 
            padding: 40px 0;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff; 
            border-radius: 24px; 
            overflow: hidden; 
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        /* Chhota aur Compact Header */
        .header { 
            padding: 20px; 
            text-align: center;
            background: #000000; /* Black background */
            border-bottom: 1px solid #f1f5f9;
        }
        .logo {
            width: 110px; /* Logo thoda bada kiya */
            height: auto;
            display: block;
            margin: 0 auto;
        }
        .content { 
            padding: 32px 32px; 
            text-align: center; 
        }
        .icon-box {
            width: 56px;
            height: 56px;
            background: #eef2ff;
            border-radius: 16px;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        h1 { 
            font-size: 22px; 
            font-weight: 800; 
            color: #111827;
            margin: 0 0 12px 0;
            letter-spacing: -0.5px;
        }
        p { 
            font-size: 15px; 
            line-height: 1.6; 
            color: #4b5563; 
            margin-bottom: 24px;
        }
        .btn { 
            display: inline-block; 
            padding: 14px 32px; 
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            color: #ffffff !important; 
            text-decoration: none; 
            border-radius: 12px; 
            font-weight: 700; 
            font-size: 15px; 
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
        }
        .expiry-text {
            display: block;
            margin-top: 18px;
            font-size: 12px;
            color: #9ca3af;
            font-weight: 500;
        }
        .footer { 
            padding: 24px; 
            text-align: center; 
            font-size: 12px; 
            color: #9ca3af;
            background: #fafafa;
        }
        .divider {
            height: 1px;
            background: #f1f5f9;
            margin: 24px 0;
        }
        .expiry-tag {
            display: inline-block;
            padding: 4px 12px;
            background: #fee2e2;
            color: #ef4444;
            border-radius: 99px;
            font-size: 12px;
            font-weight: 600;
            margin-top: 10px;
        }
        @media only screen and (max-width: 480px) {
            .container { border-radius: 0; width: 100%; }
            .content { padding: 24px 20px; }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <img src="https://hecatewizardmall.com/image/logo.png" alt="Hecate Wizard Mall" class="logo">
            </div>
            
            <div class="content">
                <div class="icon-box">
                    <span style="font-size: 24px;">🔑</span>
                </div>
                
                <h1>Password Reset</h1>
                
                <a href="${resetLink}" class="btn">Reset My Password</a>
                
              <div style="margin-top: 25px;">
                    <span class="expiry-tag">Valid for 60 minutes only</span>
                </div>

                <div class="divider"></div>
                
                <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                    If you didn't request this, just ignore this email.<br>
                    Nothing has been changed on your account.
                </p>
            </div>

            <div class="footer">
                <strong style="color: #6b7280;">Hecate Wizard Mall</strong><br>
                Magic Delivered To Your Doorstep<br><br>
                &copy; ${new Date().getFullYear()} All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>`;
};