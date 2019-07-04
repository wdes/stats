'use strict';

const Servers = require('@lib/Servers');

module.exports = (type, key) => {
    return (req, res, next) => {
        Servers.serverExists(req[type][key])
            .then(exists => {
                if (exists) {
                    next();
                } else {
                    next(new Error('Server does not exist !'));
                }
            })
            .catch(err => next(err));
    };
};
