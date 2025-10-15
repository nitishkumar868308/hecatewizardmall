// lib/templates/orderConfirmationTemplate.js
export function orderConfirmationTemplateAdmin({ name, orderId, total, downloadLink }) {
  return `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7f9fc; padding: 20px;">
    <table width="100%" cellspacing="0" cellpadding="0" 
      style="max-width: 600px; margin: auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <thead>
        <tr>
          <td style="background: linear-gradient(90deg, #0d6efd, #6610f2); padding: 30px; text-align: center; color: #fff;">
            <h1 style="margin: 0; font-size: 24px;">🎉 Order Confirmed!</h1>
            <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Thank you for shopping with us</p>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 30px 25px;">
            <p style="font-size: 16px; color: #333;">Hi <strong>${name}</strong>,</p>
            <p style="font-size: 15px; color: #555;">
              We're excited to let you know that your order has been successfully placed and is being processed.
            </p>

            <div style="background-color: #f8f9fa; border-radius: 10px; padding: 15px; margin-top: 20px;">
              <table width="100%" style="font-size: 14px; color: #444;">
                <tr>
                  <td><strong>Order ID:</strong></td>
                  <td style="text-align: right;">${orderId}</td>
                </tr>
                <tr>
                  <td><strong>Total Amount:</strong></td>
                  <td style="text-align: right;">₹${total}</td>
                </tr>
                <tr>
                  <td><strong>Status:</strong></td>
                  <td style="text-align: right; color: green;"><b>Confirmed</b></td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="${downloadLink}" 
                 style="background: #0d6efd; color: #fff; padding: 12px 25px; border-radius: 6px; 
                 text-decoration: none; font-weight: 500; display: inline-block;">
                📄 Download Invoice
              </a>
            </div>

            <p style="font-size: 14px; color: #555; margin-top: 25px;">
              You’ll receive another update when your order ships.  
              For any queries, feel free to reply to this email.
            </p>
            <p style="font-size: 14px; color: #333;">Warm regards,</p>
            <p style="font-weight: 600; color: #0d6efd;">Your Store Team</p>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td style="background-color: #f1f1f1; text-align: center; padding: 15px; font-size: 12px; color: #555;">
            © ${new Date().getFullYear()} Your Store. All rights reserved.<br/>
            <a href="#" style="color:#0d6efd; text-decoration:none;">Visit Store</a> | 
            <a href="#" style="color:#0d6efd; text-decoration:none;">Track Order</a>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>`;
}
