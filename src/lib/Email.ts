'use strict';

import * as nodemailer from 'nodemailer';

export default {
    sendEmail: function(message: string) {
        const { EMAIL_HOST, EMAIL_PORT, EMAIL_SECURE, EMAIL_USER, EMAIL_PASSWORD, EMAIL_FROM, EMAIL_TO } = process.env;
        let transporter = nodemailer.createTransport({
            host: EMAIL_HOST,
            port: parseInt(EMAIL_PORT || ''),
            secure: EMAIL_SECURE === 'YES',
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASSWORD,
            },
        });
        return transporter.sendMail({
            from: EMAIL_FROM,
            to: EMAIL_TO,
            subject: 'WdesStats',
            text: message,
        });
    },
    emailChangeStatusCode: function(name: string, prevCode: string, actualCode: string, timestamp: number) {
        var timeEvent = new Date(timestamp * 1000);
        return (
            '[WDES-STATS]\r\n' +
            'The status of server ' +
            name +
            ' changed, from: ' +
            prevCode +
            ', to: ' +
            actualCode +
            ', at: ' +
            timeEvent
        );
    },
};
