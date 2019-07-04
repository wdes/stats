'use strict';

import Servers from '@lib/Servers';
import app from '@static/Express';
import { Request, Response } from 'express';

app.get('/avgtimes', (req: Request, res: Response, next: Function) => {
    Servers.getMonitoringAvgTimes()
        .then(avgtimes => {
            res.render('pages/avgtimes.twig', {
                servers: avgtimes,
            });
        })
        .catch(err => next(err));
});
