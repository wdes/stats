'use strict';

const UA_STRING = 'Mozilla/5.0 (compatible; wdes-stats bot; +https://wdes-stats.wdes.eu)';
const U_EMAIL = 'williamdes@wdes.fr';
import * as request from 'request';

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
                    console.log({ name: server.name, url: server.url });
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
                //console.log('error:', error); // Print the error if one occurred
                //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                //console.log('body:', body); // Print the HTML for the Google homepage.
            }
        );
    });
};

/**
 * Get servers status
 * @param {array} servers The servers
 * @param {function} cbSuccess On success of all requests
 */
const getServersStatus = (servers, cbSuccess: Function): void => {
    var status: Promise<ServerStatRecord>[] = [];
    for (var server in servers) {
        status.push(getServerStatus(servers[server]));
    }
    Promise.all(status).then(values => {
        cbSuccess(values);
    });
};

module.exports = {
    getServersStatus: getServersStatus,
    getServerStatus: getServerStatus,
};
