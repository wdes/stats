'use strict';

import Sms from '@lib/Sms';
import app from '@static/Express';
import { Request, Response } from 'express';
import smsQueue from '@static/smsQueue';

app.get('/admin/operations/sendsms', (req: Request, res: Response, next: Function) => {
    res.render('pages/admin/operations/sendsms.twig');
});

app.post('/admin/operations/sendsms', (req: Request, res: Response, next: Function) => {
    let msg = '[wdes-stats][admin-operations][test]' + req.body.textToSend;
    if (req.body.sentToStack && req.body.sentToStack === 'true') {
        smsQueue.push('[queue] ' + msg);
    } else {
        Sms.sendSms('[direct] ' + msg);
    }
    res.redirect('/admin/operations/sendsms');
});
