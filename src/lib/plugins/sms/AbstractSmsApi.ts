import { Response } from 'request';

export interface ResponseInterface {
    response: Response;
    body: any;
}

export default abstract class AbstractSmsApi {
    abstract sendSms(message: string): Promise<ResponseInterface>;
}
