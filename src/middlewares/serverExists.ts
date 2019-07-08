'use strict';

import Servers from '@lib/Servers';
import { Request, Response, NextFunction } from 'express';

export default (type, key) => {
    return (req: Request, res: Response, next: NextFunction) => {
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
