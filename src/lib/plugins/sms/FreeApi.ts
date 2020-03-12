import AbstractSmsApi, { ResponseInterface } from './AbstractSmsApi';
import * as request from 'request';

export class FreeApi extends AbstractSmsApi {
    public sendSms(message: string): Promise<ResponseInterface> {
        const { FREE_SMS_API_USER, FREE_SMS_API_PASS } = process.env;
        return new Promise((resolve, reject: Error | string | any) => {
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
        });
    }
}
