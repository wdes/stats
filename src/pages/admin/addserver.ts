'use strict';

import Servers from '@lib/Servers';
import schedule from '@lib/schedule';
import app from '@static/Express';
import { Request, Response, NextFunction } from 'express';
import smsQueue from '@static/smsQueue';

app.get('/admin/addserver', (req: Request, res: Response, next: NextFunction) => {
    res.render('pages/admin/addserver.twig');
});

app.post('/admin/addserver', (req: Request, res: Response, next: NextFunction) => {
    const body = (req as any).body;
    const isDisabled = typeof body.disabled === 'string' && body.disabled === 'true';
    Servers.addServer(body.name, body.url, body.cron, isDisabled)
        .then((server) => {
            smsQueue.push(
                '[wdes-stats][admin][new-server] Added server: ' +
                    server.name +
                    ', url: ' +
                    server.url +
                    ', cron: ' +
                    server.monitoringInterval +
                    ', disabled: ' +
                    isDisabled
            );
            if (!isDisabled) {
                schedule.recordStatForServer(server);
            }
            res.redirect('/admin/servers');
        })
        .catch(next);
});
