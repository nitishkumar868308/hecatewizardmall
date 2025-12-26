// import nodemailer from "nodemailer";

// export async function sendMail({ to, subject, text, html }) {
//     const transporter = nodemailer.createTransport({
//         host: "smtp.hostinger.com",
//         port: 465,
//         secure: true,
//         auth: {
//             user: process.env.HOSTINGER_EMAIL,
//             pass: process.env.HOSTINGER_PASSWORD,
//         },
//     });

//     const info = await transporter.sendMail({
//         from: `"Hecate Wizard Mall" <${process.env.HOSTINGER_EMAIL}>`,
//         to,
//         subject,
//         text,
//         html,
//     });

//     return info;
// }


import nodemailer from "nodemailer";

export async function sendMail({ to, subject, text, html }) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: `"Hecate Wizard Mall" <${process.env.GMAIL_EMAIL}>`,
        to,
        subject,
        text,
        html,
    });

    return info;
}
