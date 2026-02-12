export const passwordResetSuccessTemplate = (name) => {
    return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
  </head>
  <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 5px 20px rgba(0,0,0,0.05);">

            <!-- Header -->
            <tr>
              <td align="center" style="background:#000;padding:20px;">
                <img src="https://hecatewizardmall.com/image/logo.png" alt="Logo" width="120" />
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:40px 30px;">
                <h2 style="margin:0 0 15px 0;color:#111;">
                  Password Reset Successful
                </h2>

                <p style="color:#555;font-size:14px;line-height:22px;">
                  Hi ${name || "User"},
                </p>

                <p style="color:#555;font-size:14px;line-height:22px;">
                  Your password has been successfully updated. 
                  If you made this change, you can safely ignore this email.
                </p>

                <div style="margin:25px 0;padding:15px;background:#f8f8f8;border-left:4px solid #000;">
                  <p style="margin:0;font-size:13px;color:#333;">
                    🔒 If you did NOT change your password, please contact our support team immediately.
                  </p>
                </div>

                <p style="color:#777;font-size:13px;">
                  For security reasons, we recommend using a strong and unique password.
                </p>

                <p style="margin-top:30px;font-size:14px;color:#111;">
                  Regards,<br/>
                  <strong>Hecate Wizard Mall</strong>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="background:#f4f4f4;padding:15px;font-size:12px;color:#999;">
                © ${new Date().getFullYear()} Hecate Wizard Mall. All rights reserved.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};
