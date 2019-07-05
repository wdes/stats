'use strict';

import * as cluster from 'cluster';
import * as Sentry from '@sentry/node';
import app from '@static/Express';
import logger from '@util/logger';
import RequestMid from '@static/RequestMid';

import * as path from 'path';
import * as packageJson from '@root/package.json';

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
    .sync(__dirname + '/../../src/pages/**/*.js')
    .forEach(function(file) {
        logger.info('Loaded page: ' + file);
        require(path.resolve(file));
    });

app.use(RequestMid.tokenMid);
logger.debug('Loading api endpoints');
require('glob')
    .sync(__dirname + '/../../src/api/**/*.js')
    .forEach(function(file) {
        logger.info('Loaded : ' + file);
        require(path.resolve(file));
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
