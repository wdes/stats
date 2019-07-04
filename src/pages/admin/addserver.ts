'use strict';

import Servers from '@lib/Servers';
import schedule from '@lib/schedule';
import app from '@static/Express';
import { Request, Response } from 'express';
import smsQueue from '@static/smsQueue';

app.get('/admin/addserver', (req: Request, res: Response, next: Function) => {
    res.render('pages/admin/addserver.twig');
});

app.post('/admin/addserver', (req: Request, res: Response, next: Function) => {
    const isDisabled = typeof req.body.disabled === 'string' && req.body.disabled === 'true';
    Servers.addServer(req.body.name, req.body.url, req.body.cron, isDisabled)
        .then(server => {
            smsQueue.push(
                '[wdes-stats][admin][new-server] Added server: ' +
                    server.name +
                    ', url: ' +
                    server.url +
                    ', cron: ' +
                    server.cron +
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
