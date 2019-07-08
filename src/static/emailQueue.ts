'use strict';

import queueLib from '@lib/queue';
import Email from '@lib/Email';

export default class emailQueue {
    private static emailQueue = queueLib.emailQueue();
    public static getQueue() {
        return emailQueue.emailQueue;
    }
    public static sendEmail(message: string) {
        return Email.sendEmail(message);
    }
}
