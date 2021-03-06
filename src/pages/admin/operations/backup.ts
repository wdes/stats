'use strict';

import app from '@static/Express';
import { Request, Response, NextFunction } from 'express';
import MonitoringServer, { MonitoringServerModel } from '@models/monitoring__servers';
import MonitoringStatusCode, { MonitoringStatusCodeModel } from '@models/monitoring__status-codes';
import MonitoringTime, { MonitoringTimeModel } from '@models/monitoring__times';
import EmailQueue from '@static/emailQueue';
// tslint:disable-next-line: no-submodule-imports
import { Attachment } from 'nodemailer/lib/mailer';

app.get('/admin/operations/backup', (req: Request, res: Response, next: NextFunction) => {
    Promise.all([MonitoringServer.findAll(), MonitoringStatusCode.findAll(), MonitoringTime.findAll()]).then(
        (models: [MonitoringServerModel[], MonitoringStatusCodeModel[], MonitoringTimeModel[]]) => {
            const backupDate = new Date().toISOString();
            const attachements: Attachment[] = [
                {
                    filename: 'servers.json',
                    content: JSON.stringify(models[0]),
                    contentType: 'application/json',
                },
                {
                    filename: 'status-codes.json',
                    content: JSON.stringify(models[1]),
                    contentType: 'application/json',
                },
                {
                    filename: 'times.json',
                    content: JSON.stringify(models[2]),
                    contentType: 'application/json',
                },
            ];
            EmailQueue.sendBackupEmail(
                'Here is your backup.\nCreated at: ' +
                    backupDate +
                    '\nServers: ' +
                    models[0].length +
                    '\nStatus-codes: ' +
                    models[1].length +
                    '\nTimes: ' +
                    models[2].length +
                    '\n\n',
                attachements
            );
        }
    );
    (req as any).session.messages = [
        {
            message: 'The backup will be send to you by email.',
            level: 'success',
        },
    ];
    res.redirect('/admin/');
});

app.get('/admin/operations/backup-servers', (req: Request, res: Response, next: NextFunction) => {
    MonitoringServer.findAll().then((models: MonitoringServerModel[]) => {
        const backupDate = new Date().toISOString();
        const attachements: Attachment[] = [
            {
                filename: 'servers.json',
                content: JSON.stringify(models),
                contentType: 'application/json',
            },
        ];
        EmailQueue.sendBackupEmail(
            'Here is your backup.\nCreated at: ' + backupDate + '\nServers: ' + models.length + '\n\n',
            attachements
        );
    });
    (req as any).session.messages = [
        {
            message: 'The backup will be send to you by email.',
            level: 'success',
        },
    ];
    res.redirect('/admin/');
});
