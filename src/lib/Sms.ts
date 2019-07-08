'use strict';

import * as request from 'request';

export default {
    sendSms: message => {
        const { FREE_SMS_API_USER, FREE_SMS_API_PASS } = process.env;
        return new Promise(
            (resolve: (data: { response: request.Response; body: any }) => void, reject: Error | string | any) => {
                if (FREE_SMS_API_USER !== undefined && FREE_SMS_API_PASS !== undefined) {
                    const msg = encodeURI(message);
                    request(
                        'https://smsapi.free-mobile.fr/sendmsg?user=' +
                            FREE_SMS_API_USER +
                            '&pass=' +
                            FREE_SMS_API_PASS +
                            '&msg=' +
                            msg,
                        (error, response, body): void => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve({ response, body });
                            }
                        }
                    );
                } else {
                    reject('Unable to send an sms');
                }
            }
        );
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
