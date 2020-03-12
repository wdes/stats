import AbstractSmsApi, { ResponseInterface } from './AbstractSmsApi';
import * as request from 'request';
import { encode } from 'urlencode';

export class SmsModeApi extends AbstractSmsApi {
    public sendSms(message: string): Promise<ResponseInterface> {
        const { SMSMODE_API_KEY, SMSMODE_TO_NUMBERS, SMSMODE_FROM_NUMBER } = process.env;
        return new Promise((resolve, reject: Error | string | any) => {
            if (SMSMODE_API_KEY !== undefined) {
                const msg = encodeURI(message);
                request(
                    'https://api.smsmode.com/http/1.6/sendSMS.do' +
                        '?accessToken=' +
                        SMSMODE_API_KEY +
                        '&numero=' +
                        SMSMODE_TO_NUMBERS +
                        '&message=' +
                        encode(message, 'ISO-8859-15') +
                        '&emetteur=' +
                        SMSMODE_FROM_NUMBER,
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
        });
    }
}
