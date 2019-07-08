'use strict';

import { Request, Response, static as staticModule, NextFunction } from 'express';
import * as express from 'express';

import logger from '@util/logger';
import sequelize from '@static/sequelize';
import githubAuth from '@src/middlewares/github-auth';
let app: express.Express = express();
logger.debug('Loading the express app');

/**
 * @apiDefine TokenAuth
 * @apiHeader (Auth) {String} Authorization The Authorization header
 * @apiHeaderExample {String} Authorization
 * Authorization: Bearer {token}
 */

app.disable('x-powered-by');
app.disable('etag');
app.set('view engine', 'twig');
app.set('views', require('path').resolve(__dirname, '..', '..', '..', 'templates'));
app.set('env', process.env.NODE_ENV || 'ZOMBIE');

import * as bodyParser from 'body-parser';
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('vhost')(process.env.APIDOCS_DOMAIN, staticModule(__dirname + '/../apidocs')));
app.use(staticModule(__dirname + '/../public'));
app.use(githubAuth.passport.initialize());

app.all('/*', function(req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'DELETE,GET,POST,OPTIONS');
    res.header(
        'Access-Control-Allow-Headers',
        'Content-type,Origin,Accept,Authorization,X-Requested-With,Cache-Control'
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noimageindex');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

app.use(
    require('cookie-session')({
        name: 'session',
        keys: [process.env.COOKIE_SECRET],

        // Cookie Options
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })
);

app.all(['/admin/*', '/admin/'], githubAuth.isAuthenticated);

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

app.on('close', () => {
    logger.info('Closing database ...');
    sequelize.sequelize.close().then(() => {
        logger.info('DB connexion closed.');
        process.exit(0);
    });
});

export default app;
