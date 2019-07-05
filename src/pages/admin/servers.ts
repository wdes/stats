'use strict';

import Servers from '@lib/Servers';
import app from '@static/Express';
import { Request, Response } from 'express';
import MonitoringServer from '@db/models/monitoring__servers';
import schedule from '@lib/schedule';

app.get('/admin/servers', (req: Request, res: Response, next: Function) => {
    Servers.listServers().then(servers => {
        res.render('pages/admin/servers.twig', {
            servers: servers,
        });
    });
});

app.post('/admin/servers/enable', (req: Request, res: Response, next: Function) => {
    MonitoringServer.findByPk(req.body.id).then(server=>{
        if (typeof server === 'object') {
            Servers.setDisabled(req.body.id, false).then(() => {
                res.redirect('/admin/servers');
            });
            schedule.scheduleServer(server);
        } else {
            res.status(404).send({
                success: false,
                message: 'Server does not exist.',
            });
        }
    });
});

app.post('/admin/servers/disable', (req: Request, res: Response, next: Function) => {
    MonitoringServer.findByPk(req.body.id).then(server=>{
        if (typeof server === 'object') {
            Servers.setDisabled(req.body.id, true).then(() => {
                res.redirect('/admin/servers');
            });
            schedule.unScheduleServer(server);
        } else {
            res.status(404).send({
                success: false,
                message: 'Server does not exist.',
            });
        }
    });
});
