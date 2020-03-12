import AbstractSmsApi, { ResponseInterface } from './AbstractSmsApi';
import logger from '@util/logger';

export class LoggerApi extends AbstractSmsApi {
    public sendSms(message: string): Promise<ResponseInterface> {
        return new Promise((resolve, reject: Error | string | any) => {
            resolve(undefined);
            logger.info('New sms:' + message);
        });
    }
}
