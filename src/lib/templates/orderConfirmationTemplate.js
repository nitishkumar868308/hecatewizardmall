export function orderConfirmationTemplate({ shippingName, orderId, total, currency, downloadLink }) {
  const currentYear = new Date().getFullYear();

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
      
      body { margin: 0; padding: 0; background-color: #f4f7f9; font-family: 'Plus Jakarta Sans', sans-serif; -webkit-font-smoothing: antialiased; }
      .wrapper { width: 100%; table-layout: fixed; background-color: #f4f7f9; padding-bottom: 40px; }
      .container { max-width: 600px; background-color: #ffffff; margin: 0 auto; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.04); }
      
      /* Black Header */
      .header { background-color: #000000; padding: 40px 20px; text-align: center; }
      .logo { max-width: 150px; height: auto; filter: brightness(0) invert(1); } /* Force white logo if needed */
      
      .content { padding: 48px 40px; text-align: center; }
      .icon-circle { width: 64px; height: 64px; background: #f0fff4; border-radius: 50%; margin: 0 auto 24px; line-height: 64px; font-size: 30px; }
      
      .order-info { background: #ffffff; border: 1px solid #eceef2; border-radius: 16px; padding: 24px; margin: 32px 0; text-align: left; }
      .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f8f9fa; }
      .info-row:last-child { border-bottom: none; }
      
      .btn-container { margin: 32px 0; }
      .button { background: #000000; color: #ffffff !important; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 15px; display: inline-block; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
      
      .footer { padding: 32px; text-align: center; color: #94a3b8; font-size: 12px; letter-spacing: 0.5px; }
      
      @media only screen and (max-width: 600px) {
        .container { border-radius: 0; }
        .content { padding: 32px 20px; }
        .button { display: block; }
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="container">
        
        <div class="header">
          <img src="https://hecatewizardmall.com/image/logo.png" alt="Logo" class="logo">
        </div>

        <div class="content">
          <div class="icon-circle">✅</div>
          <h1 style="font-size: 28px; font-weight: 800; color: #111827; margin: 0 0 12px 0; letter-spacing: -0.5px;">Order Confirmed</h1>
          <p style="font-size: 16px; color: #6b7280; line-height: 1.6; margin: 0;">
            Hi ${shippingName}, we've received your order! Your magic items are being gathered as we speak.
          </p>

          <div class="order-info">
            <table width="100%" cellspacing="0" cellpadding="0">
              <tr>
                <td style="padding: 10px 0; font-size: 14px; color: #94a3b8; font-weight: 600;">ORDER ID</td>
                <td style="padding: 10px 0; text-align: right; font-size: 14px; color: #111827; font-weight: 700;">#${orderId}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-size: 14px; color: #94a3b8; font-weight: 600;">TOTAL PAID</td>
                <td style="padding: 10px 0; text-align: right; font-size: 18px; color: #000; font-weight: 800;">${currency} ${total}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-size: 14px; color: #94a3b8; font-weight: 600;">STATUS</td>
                <td style="padding: 10px 0; text-align: right;">
                  <span style="color: #10b981; font-weight: 700; font-size: 12px; background: #ecfdf5; padding: 4px 12px; border-radius: 20px;">READY TO SHIP</span>
                </td>
              </tr>
            </table>
          </div>

          <div class="btn-container">
            <a href="${downloadLink}" class="button">DOWNLOAD TAX INVOICE</a>
          </div>

          <p style="font-size: 13px; color: #94a3b8; margin-top: 24px;">
            A copy of this receipt has been sent to your registered email.
          </p>
        </div>

        <div class="footer">
          <p style="margin-bottom: 4px; font-weight: 600; color: #475569;">HECATE WIZARD MALL</p>
          <p>© ${currentYear} All Rights Reserved.</p>
          <div style="margin-top: 15px; border-top: 1px solid #f1f5f9; padding-top: 15px;">
            <a href="#" style="color: #94a3b8; text-decoration: none; margin: 0 10px;">Support</a>
            <a href="#" style="color: #94a3b8; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
}