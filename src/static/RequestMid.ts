'use strict';

import sequelize from '@static/sequelize';
import logger from '@util/logger';
import * as Sentry from '@sentry/node';
import { QueryTypes } from 'sequelize';
import { Request, Response, NextFunction } from 'express';

import { pathToRegexp } from 'path-to-regexp';
const RequestMid = {
    tokenExists: (token, onSuccess, onError): void => {
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
            .then((data): void => {
                // tslint:disable-next-line: no-string-literal
                if (data['tokenExists'] === 1) {
                    onSuccess();
                } else {
                    onError();
                }
            })
            .catch((err): void => {
                logger.error('Erreur tokenExists : ', err);
                Sentry.captureException(err);
                onError();
            });
    },
    hasPermission: (token, scope, onSuccess, onError, req: Request): void => {
        sequelize.sequelize
            .query('SELECT hasPermission(?,?) as `hasPermission`;', {
                replacements: [token, scope],
                type: QueryTypes.SELECT,
                plain: true,
            })
            .then((data): void => {
                // tslint:disable-next-line: no-string-literal
                if (data['hasPermission'] === 1) {
                    (req as any).params._token_valid = 'true';
                    onSuccess();
                } else {
                    onError(498);
                }
            })
            .catch((err): void => {
                logger.error('Erreur hasPermission : ', err);
                Sentry.captureException(err);
                onError(500);
            });
    },
    tokenMid: (req: Request, res: Response, next: NextFunction): void => {
        // logger.debug("Start check.");
        let token: string = (req as any).body.token || (req as any).query.token || (req as any).headers.authorization;
        // tslint:disable-next-line: prefer-conditional-expression
        if (!token) {
            token = 'PuBlIcWGESsra7tbxYsDQ8PQOhMT0KeN';
        } else {
            token = token.replace('Bearer ', '');
        }
        (req as any).params._token = token;

        const keys = [];
        const re = pathToRegexp('/api/:version(\\d+)/:section/:action*', keys);
        const path = re.exec((req as any).path);
        if (path == null) {
            next();
            return;
        }
        if (path.length <= 2) {
            next();
            return;
        }
        const scope = path[2] + '.' + path[3];
        Sentry.configureScope((sentryScope) => {
            sentryScope.setUser({ token: token, scope: scope }); // FIXME: remove token from sentry
        });
        RequestMid.tokenExists(
            token,
            (): void => {
                RequestMid.hasPermission(
                    token,
                    scope,
                    () => {
                        next();
                    },
                    (code) => {
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
            (): Response => {
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
