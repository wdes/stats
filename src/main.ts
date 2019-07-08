'use strict';

import * as cluster from 'cluster';
import * as Sentry from '@sentry/node';
import app from '@static/Express';
import logger from '@util/logger';
import RequestMid from '@static/RequestMid';

import * as path from 'path';
import * as packageJson from '@root/package.json';
import { Request, Response, NextFunction } from 'express';
import { AddressInfo } from 'net';
import { AppMessage, AppMessageTypes } from '@lib/interfaces';

// https://devcenter.heroku.com/articles/dyno-metadata
// TODO: if env empty no append if not empty join array using dash (-)
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
    .forEach(file => {
        // logger.info('Loaded page: ' + file);
        require(path.resolve(file));
    });

app.use(RequestMid.tokenMid);
logger.debug('Loading api endpoints');
require('glob')
    .sync(__dirname + '/../src/api/**/*.js')
    .forEach(file => {
        // logger.info('Loaded : ' + file);
        require(path.resolve(file));
    });

app.use((req: Request, res: Response): void => {
    res.status(404).send({ msg: '404: Page not Found' });
});
if (app.get('env') === 'development') {
    app.use(require('errorhandler')());
}
app.use((err, req: Request, res: Response, next: NextFunction) => {
    // if (app.get('env') == 'test') {
    // logger.error(err);
    // }
    res.status(500).send({ success: false, msg: err.message });
    Sentry.captureException(err);
});

logger.debug('Start the express server');
const PORT = process.env.PORT || 4500;
const localServer = app.listen(PORT, () => {
    const serverAddress = localServer.address();
    if (typeof serverAddress === 'object' && serverAddress !== null) {
        const address: AddressInfo = serverAddress;
        const port = address.port;
        logger.info('Serveur WdesStats démarré sur le port : %s', port);
    }
    app.emit('appStarted');
});

app.on(AppMessageTypes.APP_STOP, () => {
    logger.info('Received (appStop) ...');
    localServer.close(() => {
        logger.info('Express is closed.');
    });
    app.emit('close');
});

process.on('message', (message: AppMessage): void => {
    app.emit(message.topic, message); // Retransmission de l'event dans expressJS
});
process.on('SIGTERM', (): void => {
    logger.info('Terminating (SIGTERM) ...');
    app.emit('appStop');
});
process.on('SIGINT', () => {
    logger.info('Terminating (SIGINT) ...');
    app.emit('appStop');
});
