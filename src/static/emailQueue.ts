'use strict';

import * as BetterQueue from 'better-queue';
import stack from '@lib/stack';
import * as nodemailer from 'nodemailer';
// tslint:disable-next-line: no-submodule-imports
import { Attachment } from 'nodemailer/lib/mailer';
import logger from '@util/logger';
import { getStore } from '@lib/queue';

export default class EmailQueue {
    private static emailQueue: BetterQueue | null = null;
    public static getQueue() {
        if (EmailQueue.emailQueue === null) {
            const emailStack = stack();
            emailStack.init(
                10000,
                () => {
                    // Tick callback
                },
                (messages) => {
                    messages.forEach((message) => {
                        EmailQueue.sendEmail(message).catch((err) => {
                            logger.error(err);
                        });
                    });
                }
            );
            EmailQueue.emailQueue = new BetterQueue(
                (input, cb) => {
                    emailStack.addToStack(input);
                    cb(null, {});
                },
                {
                    batchSize: 1,
                    concurrent: 1,
                    filo: true,
                    store: getStore('email'),
                }
            );
        }
        return EmailQueue.emailQueue;
    }
    public static sendEmail(message: string) {
        const { EMAIL_FROM, EMAIL_TO } = process.env;
        return EmailQueue.getTransporter().sendMail({
            from: EMAIL_FROM,
            to: EMAIL_TO,
            subject: 'WdesStats',
            text: message,
        });
    }
    public static sendBackupEmail(message: string, attachments: Attachment[]) {
        const { EMAIL_FROM, EMAIL_TO } = process.env;
        return EmailQueue.getTransporter().sendMail({
            from: EMAIL_FROM,
            to: EMAIL_TO,
            subject: 'WdesStats - Backup',
            text: message,
            attachments: attachments,
        });
    }
    public static getTransporter(): nodemailer.Transporter {
        const { EMAIL_HOST, EMAIL_PORT, EMAIL_SECURE, EMAIL_USER, EMAIL_PASSWORD } = process.env;
        return nodemailer.createTransport({
            host: EMAIL_HOST,
            port: parseInt(EMAIL_PORT || '', 10),
            secure: EMAIL_SECURE === 'YES',
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASSWORD,
            },
        });
    }
}
