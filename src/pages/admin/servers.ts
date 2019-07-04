'use strict';

import Servers from '@lib/Servers';
import app from '@static/Express';
import { Request, Response } from 'express';

app.get('/admin/servers', (req: Request, res: Response, next: Function) => {
    Servers.listServers().then(servers => {
        res.render('pages/admin/servers.twig', {
            servers: servers,
        });
    });
});

app.post('/admin/servers/enable', (req: Request, res: Response, next: Function) => {
    Servers.setDisabled(req.body.id, false).then(() => {
        res.redirect('/admin/servers');
    });
});

app.post('/admin/servers/disable', (req: Request, res: Response, next: Function) => {
    Servers.setDisabled(req.body.id, true).then(() => {
        res.redirect('/admin/servers');
    });
});
