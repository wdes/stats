'use strict';

const UA_STRING = 'Mozilla/5.0 (compatible; wdes-stats bot; +https://wdes-stats.wdes.eu)';
const U_EMAIL = 'williamdes@wdes.fr';
import * as request from 'request';
import logger from '@util/logger';

export interface ServerStatRecord {
    id: number;
    name: string;
    url: string;
    statusCode: number;
    times?: {
        wait: number;
        dns: number;
        tcp: number;
        firstByte: number;
        download: number;
        total: number;
    };
}

/**
 * Get the server status
 */
const getServerStatus = (server, method: string = 'HEAD') => {
    return new Promise((resolve: (data: ServerStatRecord) => void, reject) => {
        request(
            server.url,
            {
                method: method,
                followAllRedirects: false,
                followRedirect: false,
                time: true,
                headers: {
                    'User-Agent': UA_STRING,
                    From: U_EMAIL,
                },
            },
            (error, response, body) => {
                if (error) {
                    logger.debug({ name: server.name, url: server.url });
                    reject(error);
                } else {
                    resolve({
                        id: server.id,
                        name: server.name,
                        url: server.url,
                        statusCode: response.statusCode,
                        times: response.timingPhases,
                    });
                }
                // logger.debug('error:', error); // Print the error if one occurred
                // logger.debug('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                // logger.debug('body:', body); // Print the HTML for the Google homepage.
            }
        );
    });
};

/**
 * Get servers status
 * @param {array} servers The servers
 * @param {function} cbSuccess On success of all requests
 */
const getServersStatus = (servers, cbSuccess: (data: any[]) => void): void => {
    const status: Promise<ServerStatRecord>[] = [];
    for (const server in servers) {
        status.push(getServerStatus(servers[server]));
    }
    Promise.all(status).then((values) => {
        cbSuccess(values);
    });
};

module.exports = {
    getServersStatus: getServersStatus,
    getServerStatus: getServerStatus,
};
