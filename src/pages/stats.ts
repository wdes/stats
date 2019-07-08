'use strict';

import Servers from '@lib/Servers';
import app from '@static/Express';
import { Request, Response, NextFunction } from 'express';
import serverExists from '@middlewares/serverExists';

app.get('/stats/:idServer', serverExists('params', 'idServer'), (req: Request, res: Response, next: NextFunction) => {
    Servers.getMonitoringTimes(req.params.idServer)
        .then(monitoringTimes => {
            Servers.percentageOfStatusCodesByServer(req.params.idServer)
                .then(percentagesByCodes => {
                    res.render('pages/stats.twig', {
                        server: req.params.idServer,
                        rowsTimes: JSON.stringify(monitoringTimes),
                        rowsPercentageStatusCodes: JSON.stringify(percentagesByCodes),
                    });
                })
                .catch(err => next(err));
        })
        .catch(err => next(err));
});
