'use strict';

import { ResponseInterface } from '@lib-plugins/sms/AbstractSmsApi';
import { FreeApi } from '@lib-plugins/sms/FreeApi';
import { LoggerApi } from '@lib-plugins/sms/LoggerApi';
import { SmsModeApi } from '@lib-plugins/sms/SmsModeApi';
import { EmailApi } from '@lib-plugins/sms/EmailApi';

export default {
    sendSms(message: string): Promise<ResponseInterface> {
        switch (process.env.SMS_PROVIDER) {
            case 'free':
                return new FreeApi().sendSms(message);
            case 'smsmode':
                return new SmsModeApi().sendSms(message);
            case 'email':
                return new EmailApi().sendSms(message);
            case 'logger':
            default:
                return new LoggerApi().sendSms(message);
        }
    },
    smsChangeStatusCode: (name, prevCode, actualCode, timestamp): string => {
        const timeEvent = new Date(timestamp * 1000);
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
