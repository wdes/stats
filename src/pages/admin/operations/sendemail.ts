'use strict';

import app from '@static/Express';
import { Request, Response, NextFunction } from 'express';
import EmailQueue from '@static/emailQueue';

app.get('/admin/operations/sendemail', (req: Request, res: Response, next: NextFunction) => {
    res.render('pages/admin/operations/sendemail.twig');
});

app.post('/admin/operations/sendemail', (req: Request, res: Response, next: NextFunction) => {
    const body = (req as any).body;
    const msg = '[wdes-stats][admin-operations][test]' + body.textToSend;
    if (body.sentToStack && body.sentToStack === 'true') {
        EmailQueue.getQueue().push('[queue] ' + msg);
    } else {
        EmailQueue.sendEmail('[direct] ' + msg);
    }
    res.redirect('/admin/operations/sendemail');
});
