'use strict';

const packageJson = require('@root/package.json');
const express = require('express');
const path = require('path');
global.joi = require('joi');
global.app = express();
global.Sentry = require('@sentry/node');

// https://devcenter.heroku.com/articles/dyno-metadata
//TODO: if env empty no append if not empty join array using dash (-)
const envDesc = '-' + (process.env.HEROKU_APP_NAME || '') + '-' + (process.env.HEROKU_RELEASE_VERSION || '');
const sentryconfig = {
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

/**
 * @apiDefine TokenAuth
 * @apiHeader (Auth) {String} Authorization The Authorization header
 * @apiHeaderExample {String} Authorization
 * Authorization: Bearer {token}
 */
const tokenMid = require('@static/RequestMid').tokenMid;
global.validationMid = require('@static/ValidationMid')(global.joi);

app.disable('x-powered-by');
app.disable('etag');
app.set('view engine', 'twig');
app.set('views', require('path').resolve(__dirname, '..', 'templates'));
app.set('env', process.env.NODE_ENV || 'ZOMBIE');

logger.info('Environnement : %s', app.get('env'));
app.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'DELETE,GET,POST,OPTIONS');
    res.header(
        'Access-Control-Allow-Headers',
        'Content-type,Origin,Accept,Authorization,X-Requested-With,Cache-Control'
    );
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noimageindex');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('vhost')(process.env.APIDOCS_DOMAIN, express.static(__dirname + '/../apidocs')));
app.use(express.static(__dirname + '/../public'));

require('glob')
    .sync(__dirname + '/../src/pages/**/*.js')
    .forEach(function(file) {
        //logger.info("Loaded page: "+file);
        require(path.resolve(file));
    });

app.use(tokenMid);

require('glob')
    .sync(__dirname + '/../src/api/**/*.js')
    .forEach(function(file) {
        //logger.info("Loaded : "+file);
        require(path.resolve(file));
    });

/**
 * @apiDefine 202AcceptedSuccess
 * @apiSuccess (202) {Boolean} success Is a success
 * @apiSuccessExample {json} 202 Success
 *    HTTP/1.1 202 Success
 *    {
 *      "success": true
 *    }
 */

/**
 * @apiDefine 302FoundSuccess
 * @apiSuccess (302) {Boolean} success Is a success
 * @apiSuccessExample {json} 302 Found
 *    HTTP/1.1 302 Found
 *    {
 *      "success": true
 *    }
 */

/**
 * @apiDefine 200OkSuccess
 * @apiSuccess (200) {Boolean} success Is a success
 * @apiSuccessExample {json} 200 OK
 *    HTTP/1.1 200 OK
 *    {
 *      "success": true
 *    }
 */

/**
 * @apiDefine 201Success
 * @apiSuccess (201) {Boolean} success Is a success
 * @apiSuccessExample {json} 200 OK
 *    HTTP/1.1 201 Success
 *    {
 *      "success": true
 *    }
 */

/**
 * @apiDefine 404NotFoundError
 * @apiError (404) {String} msg The error message
 * @apiError (404) {Boolean} success Is a success
 * @apiErrorExample {json} 404 Not Found
 *    HTTP/1.1 404 Not Found
 *    {
 *      "msg": "404: Page not Found",
 *      "success": false
 *    }
 */
app.use(function(req, res) {
    res.status(404).send({ msg: '404: Page not Found' });
});
if (app.get('env') == 'development') {
    app.use(require('errorhandler')());
}
/**
 * @apiDefine MsgError
 * @apiError (500) {String} msg The error message
 * @apiError (500) {Boolean} success Is a success
 * @apiErrorExample {json} 500 Internal Server Error
 *    HTTP/1.1 500 Internal Server Error
 *    {
 *      "msg": "The error message",
 *      "success": false
 *    }
 */
app.use(function(err, req, res, next) {
    // if (app.get('env') == 'test') {
    //logger.error(err);
    // }
    res.status(500).send({ success: false, msg: err.message });
    Sentry.captureException(err);
});
const PORT = process.env.PORT || 4500;
global._server = app.listen(PORT, function() {
    var port = global._server.address().port;
    logger.info('Serveur WdesStats démarré sur le port : %s', port);
    app.emit('appStarted');
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
app.on('appStop', function() {
    logger.info('Received (appStop) ...');
    global._server.close(function() {
        logger.info('Express is closed.');
    });
    app.emit('close');
});
app.on('close', function() {
    logger.info('Closing database ...');
    global.sequelize.sequelize.close().then(() => {
        logger.info('DB connexion closed.');
        process.exit(0);
    });
});

module.exports = app;
