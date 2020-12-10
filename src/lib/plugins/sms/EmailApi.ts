import AbstractSmsApi, { ResponseInterface } from './AbstractSmsApi';
import EmailQueue from '@static/emailQueue';
import { Response } from 'request';

export class EmailApi extends AbstractSmsApi {
    public sendSms(message: string): Promise<ResponseInterface> {
        return new Promise((resolve, reject: Error | string | any) => {
            resolve({
                response: (null as any) as Response,
                body: null,
            });
            EmailQueue.sendEmail(message);
        });
    }
}
