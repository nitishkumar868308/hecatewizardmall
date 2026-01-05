export const adminReplyTemplate = ({ name, originalMessage, replyMessage }) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Admin Reply</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f0f2f5;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        padding: 25px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
      h2 {
        color: #333333;
        font-size: 20px;
        margin-bottom: 10px;
      }
      p {
        color: #555555;
        line-height: 1.6;
      }
      .original, .reply {
        border-radius: 8px;
        padding: 15px;
        margin: 15px 0;
      }
      .original {
        background-color: #f9f9f9;
        border-left: 4px solid #888;
      }
      .reply {
        background-color: #e6f0ff;
        border-left: 4px solid #1a73e8;
      }
      .footer {
        margin-top: 20px;
        font-size: 12px;
        color: #999999;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Hello ${name},</h2>
      <p>We have replied to your message. See below:</p>

      <div class="original">
        <strong>Your original message:</strong>
        <p>${originalMessage}</p>
      </div>

      <div class="reply">
        <strong>Our reply:</strong>
        <p>${replyMessage}</p>
      </div>

      <p>Thank you for reaching out to us!</p>
      <p class="footer">This is an automated email from your website. Please do not reply.</p>
    </div>
  </body>
  </html>
  `;
};
