import { OAuth2Client } from 'google-auth-library';
import * as nodemailer from 'nodemailer';

export const sendMail = async (to: string, subject: string, htmlContent: string) => {
    // if (
    //     !process.env.MAIL_HOST ||
    //     !process.env.MAIL_PORT ||
    //     !process.env.MAIL_USER ||
    //     !process.env.MAIL_PASS
    // ) {
    //     return Error('Env  for send mail not found.')
    // }

    if (
        !process.env.GOOGLE_MAILER_CUSTOMER_ID ||
        !process.env.GOOGLE_MAILER_CUSTOMER_SECRET ||
        !process.env.GOOGLE_MAILER_REFRESH_TOKEN ||
        !process.env.ADMIN_EMAIL_ADDRESS
    ) {
        throw Error('Env for send mail not found.');
    }

    const myOAuth2Client = new OAuth2Client(
        process.env.GOOGLE_MAILER_CUSTOMER_ID,
        process.env.GOOGLE_MAILER_CUSTOMER_SECRET,
    );

    myOAuth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
    });

    const myAccessTokenObject = await myOAuth2Client.getAccessToken();
    console.log('myAccessTokenObject', myAccessTokenObject);

    // const transporter = nodemailer.createTransport({
    //     host: process.env.MAIL_HOST,
    //     port: process.env.MAIL_PORT,
    //     secure: false,
    //     auth: {
    //         user: process.env.MAIL_USER,
    //         pass: process.env.MAIL_PASS
    //     },
    // });

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.ADMIN_EMAIL_ADDRESS,
            clientId: process.env.GOOGLE_MAILER_CUSTOMER_ID,
            clientSecret: process.env.GOOGLE_MAILER_CUSTOMER_SECRET,
            refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
            accessToken: myAccessTokenObject?.token,
        },
    });

    const options = {
        from: process.env.ADMIN_EMAIL_ADDRESS,
        to: to,
        subject: subject,
        html: htmlContent,
        // attachments: {
        //     filename: 'test.png',
        //     path: 'http://183.81.32.36:8000/uploads/image_2021-10-04_14-25-21-10740.png'
        // }
    };

    return transporter.sendMail(options)
}