'use strict';

import * as cluster from 'cluster';
import * as Sentry from '@sentry/node';
import app from '@static/Express';
import logger from '@util/logger';
import RequestMid from '@static/RequestMid';

import * as path from 'path';
import * as packageJson from '@root/package.json';
import { Request, Response } from 'express';
import { AddressInfo } from 'net';

// https://devcenter.heroku.com/articles/dyno-metadata
//TODO: if env empty no append if not empty join array using dash (-)
const envDesc = '-' + (process.env.HEROKU_APP_NAME || '') + '-' + (process.env.HEROKU_RELEASE_VERSION || '');
const sentryconfig: any = {
    release: packageJson.name + '@' + packageJson.version,
    environment: process.env.NODE_ENV + envDesc,
    serverName: require('os').hostname() || null,
};

logger.debug('Release: ' + sentryconfig.release);
logger.debug('Environment: ' + sentryconfig.environment);
logger.debug('Server name: ' + sentryconfig.serverName);

if (process.env.SENTRY_DSN) {
    sentryconfig.dsn = process.env.SENTRY_DSN;
    logger.info('Sentry configured');
}

Sentry.init(sentryconfig);

logger.info('Démarrage du worker n°%d', cluster.worker.id);

logger.info('Environnement : %s', app.get('env'));

logger.debug('Loading pages');
require('glob')
    .sync(__dirname + '/../src/pages/**/*.js')
    .forEach(function(file) {
        //logger.info('Loaded page: ' + file);
        require(path.resolve(file));
    });

app.use(RequestMid.tokenMid);
logger.debug('Loading api endpoints');
require('glob')
    .sync(__dirname + '/../src/api/**/*.js')
    .forEach(function(file) {
        //logger.info('Loaded : ' + file);
        require(path.resolve(file));
    });

app.use(function(req, res) {
    res.status(404).send({ msg: '404: Page not Found' });
});
if (app.get('env') == 'development') {
    app.use(require('errorhandler')());
}
app.use(function(err, req: Request, res: Response, next: Function) {
    // if (app.get('env') == 'test') {
    //logger.error(err);
    // }
    res.status(500).send({ success: false, msg: err.message });
    Sentry.captureException(err);
});

logger.debug('Start the express server');
const PORT = process.env.PORT || 4500;
let _server = app.listen(PORT, () => {
    let serverAddress = _server.address();
    if (typeof serverAddress === 'object' && serverAddress !== null) {
        let address: AddressInfo = serverAddress;
        var port = address.port;
        logger.info('Serveur WdesStats démarré sur le port : %s', port);
    }
    app.emit('appStarted');
});

app.on('appStop', () => {
    logger.info('Received (appStop) ...');
    _server.close(() => {
        logger.info('Express is closed.');
    });
    app.emit('close');
});

process.on('message', function(message) {
    app.emit(message.type, message); // Retransmission de l'event dans expressJS
});
process.on('SIGTERM', function() {
    logger.info('Terminating (SIGTERM) ...');
    app.emit('appStop');
});
process.on('SIGINT', () => {
    logger.info('Terminating (SIGINT) ...');
    app.emit('appStop');
});
