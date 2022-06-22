import * as nodemailer from 'nodemailer';

export const sendMail = (to: string, subject: string, htmlContent: string) => {
    if (
        !process.env.MAIL_HOST ||
        !process.env.MAIL_PORT ||
        !process.env.MAIL_USER ||
        !process.env.MAIL_PASS
    ) {
        return Error('Env  for send mail not found.')
    }

    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        },
    });

    const options = {
        from: process.env.MAIL_USER,
        to: to,
        subject: subject,
        html: htmlContent
    };

    return transporter.sendMail(options)
}