'use strict';

import sequelize from '@static/sequelize';
import logger from '@util/logger';
import * as Sentry from '@sentry/node';
import { QueryTypes } from 'sequelize';
import { Request, Response, NextFunction } from 'express';

import * as pathToRegexp from 'path-to-regexp';
const RequestMid = {
    tokenExists: function(token, onSuccess, onError) {
        if (token.length > 32) {
            onError(400);
            return;
        }
        sequelize.sequelize
            .query('SELECT tokenExists(?) as `tokenExists`;', {
                replacements: [token],
                type: QueryTypes.SELECT,
                plain: true,
            })
            .then(function(data) {
                if (data.tokenExists === 1) {
                    onSuccess();
                } else {
                    onError();
                }
            })
            .catch(function(err) {
                logger.error('Erreur tokenExists : ', err);
                Sentry.captureException(err);
                onError();
            });
    },
    hasPermission: function(token, scope, onSuccess, onError, req) {
        sequelize.sequelize
            .query('SELECT hasPermission(?,?) as `hasPermission`;', {
                replacements: [token, scope],
                type: QueryTypes.SELECT,
                plain: true,
            })
            .then(function(data) {
                if (data.hasPermission === 1) {
                    req.params._token.valid = true;
                    onSuccess();
                } else {
                    onError(498);
                }
            })
            .catch(function(err) {
                logger.error('Erreur hasPermission : ', err);
                Sentry.captureException(err);
                onError(500);
            });
    },
    tokenMid: function(req: Request, res: Response, next: NextFunction) {
        //logger.debug("Start check.");
        var token = req.body.token || req.query.token || req.headers.authorization;
        if (!token) {
            token = 'PuBlIcWGESsra7tbxYsDQ8PQOhMT0KeN';
        } else {
            token = token.replace('Bearer ', '');
        }
        req.params._token = { token: token };

        var keys = [];
        var re = pathToRegexp('/api/:version(\\d+)/:section/:action*', keys);
        var path = re.exec(req.path);
        if (path == null) {
            next();
            return;
        }
        if (path.length <= 2) {
            next();
            return;
        }
        var scope = path[2] + '.' + path[3];
        Sentry.configureScope(scope => {
            scope.setUser({ token: token, scope: scope }); //FIXME: remove token from sentry
        });
        RequestMid.tokenExists(
            token,
            function() {
                RequestMid.hasPermission(
                    token,
                    scope,
                    function() {
                        next();
                    },
                    function(code) {
                        if (code === 500) {
                            Sentry.captureMessage('Token verification failed.', Sentry.Severity.Critical);
                            return res.status(500).send({
                                success: false,
                                message: 'Token verification failed.',
                            });
                        } else if (code === 498) {
                            Sentry.captureMessage('Invalid token for requested scope.', Sentry.Severity.Debug);
                            return res.status(498).send({
                                success: false,
                                message: 'Invalid token for requested scope.',
                            });
                        }
                    },
                    req
                );
            },
            function() {
                Sentry.captureMessage('Invalid token.', Sentry.Severity.Debug);
                return res.status(401).send({
                    success: false,
                    message: 'Invalid token.',
                });
            }
        );
    },
};
export default RequestMid;
