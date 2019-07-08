'use strict';

import githubAuth from '@middlewares/github-auth';
import app from '@static/Express';
import { Request, Response, NextFunction } from 'express';
import smsQueue from '@static/smsQueue';
import EmailQueue from '@static/emailQueue';

app.get('/queues', githubAuth.isAuthenticated, (req: Request, res: Response, next: NextFunction) => {
    res.render('pages/queues.twig', {
        smsQueueTasksCount: smsQueue.getStats().total,
        emailQueueTasksCount: EmailQueue.getQueue().getStats().total,
    });
});
