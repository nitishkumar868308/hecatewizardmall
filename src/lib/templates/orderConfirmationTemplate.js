export function orderConfirmationTemplate({ name, orderId, total }) {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto; border:1px solid #eee; border-radius:10px; overflow:hidden;">
      <div style="background-color:#0d6efd; color:white; padding:20px; text-align:center;">
        <h2>🎉 Order Confirmed!</h2>
      </div>
      <div style="padding:20px;">
        <p>Hi <strong>${name}</strong>,</p>
        <p>Thank you for shopping with us! Your order has been successfully placed and confirmed.</p>

        <div style="background-color:#f8f9fa; padding:15px; border-radius:8px; margin-top:15px;">
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Total Amount:</strong> ₹${total}</p>
        </div>

        <p style="margin-top:20px;">You’ll receive another email when your order ships.</p>
        <p>Best regards,<br/><strong>Your Store Team</strong></p>
      </div>
      <div style="background-color:#f1f1f1; padding:10px; text-align:center; font-size:12px; color:#555;">
        © ${new Date().getFullYear()} Your Store. All rights reserved.
      </div>
    </div>`;
}
