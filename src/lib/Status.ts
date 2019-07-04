'use strict';

const request = require('request');
const UA_STRING = 'Mozilla/5.0 (compatible; wdes-stats bot; +https://wdes-stats.wdes.eu)';
const U_EMAIL = 'williamdes@wdes.fr';

module.exports = {
    getServerStatus: function(url, method) {
        return new Promise((resolve, reject) => {
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
                function(error, response, body) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(response, body);
                    }
                }
            );
        });
    },
};
