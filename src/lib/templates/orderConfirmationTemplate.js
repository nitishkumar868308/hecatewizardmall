export function orderConfirmationTemplate({ shippingName, orderId, total, currency, downloadLink }) {
  const currentYear = new Date().getFullYear();

  return `
  <!DOCTYPE html>
  <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { margin: 0; padding: 0; width: 100% !important; background-color: #f1f5f9; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
      img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
      
      .wrapper { width: 100%; table-layout: fixed; background-color: #f1f5f9; }
      .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; }
      
      /* Mobile optimization */
      @media only screen and (max-width: 600px) {
        .content-padding { padding: 30px 20px !important; }
        .hero-text { font-size: 26px !important; }
        .btn-full { display: block !important; width: 100% !important; box-sizing: border-box; }
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <center>
        <table class="container" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 40px; margin-bottom: 40px;">
          
          <tr>
            <td align="center" bgcolor="#000000" style="padding: 40px 20px;">
              <img src="https://hecatewizardmall.com/image/logo.png" alt="Logo" width="150" style="display: block; filter: brightness(0) invert(1);">
            </td>
          </tr>

          <tr>
            <td class="content-padding" style="padding: 50px 50px 20px 50px; text-align: center; font-family: sans-serif;">
              <h1 class="hero-text" style="margin: 0; font-size: 32px; font-weight: 800; color: #1e293b; letter-spacing: -1px;">Your magic is on its way!</h1>
              <p style="margin: 15px 0 0 0; font-size: 16px; color: #64748b; line-height: 1.6;">
                Hi ${shippingName}, we've received your order and our wizards are preparing your package.
              </p>
            </td>
          </tr>

          <tr>
            <td class="content-padding" style="padding: 20px 50px;">
              <table width="100%" cellpadding="20" cellspacing="0" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="font-family: sans-serif; font-size: 13px; color: #94a3b8; font-weight: 600; text-transform: uppercase;">Order Number</td>
                        <td align="right" style="font-family: sans-serif; font-size: 14px; color: #1e293b; font-weight: 700;">#${orderId}</td>
                      </tr>
                      <tr><td height="15" colspan="2" style="border-bottom: 1px solid #e2e8f0;"></td></tr>
                      <tr><td height="15" colspan="2"></td></tr>
                      <tr>
                        <td style="font-family: sans-serif; font-size: 15px; color: #1e293b; font-weight: 600;">Total Paid</td>
                        <td align="right" style="font-family: sans-serif; font-size: 22px; color: #000000; font-weight: 800;">${currency} ${total}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="content-padding" style="padding: 20px 50px 40px 50px; text-align: center;">
              <a href="${downloadLink}" class="btn-full" style="background-color: #000000; color: #ffffff; padding: 18px 35px; text-decoration: none; font-family: sans-serif; font-size: 16px; font-weight: 700; border-radius: 12px; display: inline-block;">
                Download Tax Invoice
              </a>
              <p style="margin: 20px 0 0 0; font-family: sans-serif; font-size: 12px; color: #94a3b8;">
                Link expires in 5 minutes for security.
              </p>
            </td>
          </tr>

          <tr>
            <td bgcolor="#f8fafc" style="padding: 40px 20px; border-top: 1px solid #f1f5f9; text-align: center; font-family: sans-serif;">
              <p style="margin: 0; font-size: 14px; font-weight: 700; color: #1e293b;">HECATE WIZARD MALL</p>
              <p style="margin: 8px 0; font-size: 12px; color: #94a3b8;">&copy; ${currentYear} All Rights Reserved.</p>
              <div style="margin-top: 15px; font-size: 12px;">
                <a href="#" style="color: #64748b; text-decoration: none;">Support</a> &nbsp;•&nbsp;
                <a href="#" style="color: #64748b; text-decoration: none;">Privacy Policy</a> &nbsp;•&nbsp;
                <a href="#" style="color: #64748b; text-decoration: none;">Track Order</a>
              </div>
            </td>
          </tr>

        </table>
      </center>
    </div>
  </body>
  </html>
  `;
}