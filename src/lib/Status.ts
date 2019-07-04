'use strict';

import * as request from 'request';
const UA_STRING = 'Mozilla/5.0 (compatible; wdes-stats bot; +https://wdes-stats.wdes.eu)';
const U_EMAIL = 'williamdes@wdes.fr';

export default {
    getServerStatus: (url: string, method: string) => {
        return new Promise((resolve: (data: { response: request.Response; body: any }) => void, reject) => {
            request(
                {
                    url: url,
                    method: method,
                    followAllRedirects: false,
                    followRedirect: false,
                    time: true,
                    headers: {
                        'User-Agent': UA_STRING,
                        From: U_EMAIL,
                    },
                },
                (error: any, response: request.Response, body: any) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({ response, body });
                    }
                }
            );
        });
    },
};
