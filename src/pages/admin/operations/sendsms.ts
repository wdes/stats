'use strict';

import Sms from '@lib/Sms';
import app from '@static/Express';
import { Request, Response, NextFunction } from 'express';
import smsQueue from '@static/smsQueue';

app.get('/admin/operations/sendsms', (req: Request, res: Response, next: NextFunction) => {
    res.render('pages/admin/operations/sendsms.twig');
});

app.post('/admin/operations/sendsms', (req: Request, res: Response, next: NextFunction) => {
    const body = (req as any).body;
    const msg = '[wdes-stats][admin-operations][test]' + body.textToSend;
    if (body.sentToStack && body.sentToStack === 'true') {
        smsQueue.push('[queue] ' + msg);
    } else {
        Sms.sendSms('[direct] ' + msg);
    }
    res.redirect('/admin/operations/sendsms');
});
