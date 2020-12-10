import AbstractSmsApi, { ResponseInterface } from './AbstractSmsApi';
import logger from '@util/logger';
import { Response } from 'request';

export class LoggerApi extends AbstractSmsApi {
    public sendSms(message: string): Promise<ResponseInterface> {
        return new Promise((resolve, reject: Error | string | any) => {
            resolve({
                response: (null as any) as Response,
                body: null,
            });
            logger.info('New sms:' + message);
        });
    }
}
