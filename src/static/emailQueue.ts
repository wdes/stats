'use strict';

import * as BetterQueue from 'better-queue';
import stack from '@lib/stack';
import * as nodemailer from 'nodemailer';
import { Attachment } from 'nodemailer/lib/mailer';
import logger from '@util/logger';
import { getStore } from '@lib/queue';

export default class emailQueue {
    private static emailQueue: BetterQueue | null = null;
    public static getQueue() {
        if (emailQueue.emailQueue === null) {
            let emailStack = stack();
            emailStack.init(
                10000,
                () => {
                    //Tick callback
                },
                messages => {
                    messages.forEach(message => {
                        emailQueue.sendEmail(message).catch(err => {
                            logger.error(err);
                        });
                    });
                }
            );
            emailQueue.emailQueue = new BetterQueue(
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
        return emailQueue.emailQueue;
    }
    public static sendEmail(message: string) {
        const { EMAIL_FROM, EMAIL_TO } = process.env;
        return emailQueue.getTransporter().sendMail({
            from: EMAIL_FROM,
            to: EMAIL_TO,
            subject: 'WdesStats',
            text: message,
        });
    }
    public static sendBackupEmail(message: string, attachments: Attachment[]) {
        const { EMAIL_FROM, EMAIL_TO } = process.env;
        return emailQueue.getTransporter().sendMail({
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
            port: parseInt(EMAIL_PORT || ''),
            secure: EMAIL_SECURE === 'YES',
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASSWORD,
            },
        });
    }
}
