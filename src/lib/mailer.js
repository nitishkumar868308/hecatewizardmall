import nodemailer from "nodemailer";

export async function sendMail({ to, subject, text, html }) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,         // SSL
        secure: true,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: `"Your App Name" <${process.env.GMAIL_USER}>`,
        to,
        subject,
        text,
        html,
    });

    return info;
}
