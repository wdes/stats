'use strict';

import app from '@static/Express';
import { Request, Response, NextFunction } from 'express';
import EmailQueue from '@static/emailQueue';

app.get('/admin/operations/sendemail', (req: Request, res: Response, next: NextFunction) => {
    res.render('pages/admin/operations/sendemail.twig');
});

app.post('/admin/operations/sendemail', (req: Request, res: Response, next: NextFunction) => {
    const msg = '[wdes-stats][admin-operations][test]' + req.body.textToSend;
    if (req.body.sentToStack && req.body.sentToStack === 'true') {
        EmailQueue.getQueue().push('[queue] ' + msg);
    } else {
        EmailQueue.sendEmail('[direct] ' + msg);
    }
    res.redirect('/admin/operations/sendemail');
});
