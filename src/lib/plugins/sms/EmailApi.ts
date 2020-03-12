import AbstractSmsApi, { ResponseInterface } from './AbstractSmsApi';
import EmailQueue from '@static/emailQueue';

export class EmailApi extends AbstractSmsApi {
    public sendSms(message: string): Promise<ResponseInterface> {
        return new Promise((resolve, reject: Error | string | any) => {
            resolve(undefined);
            EmailQueue.sendEmail(message);
        });
    }
}
