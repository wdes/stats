'use strict';

import githubAuth from '@src/middlewares/github-auth';
import app from '@static/Express';
import { Request, Response, NextFunction } from 'express';
import smsQueue from '@static/smsQueue';
import emailQueue from '@static/emailQueue';

app.get('/queues', githubAuth.isAuthenticated, (req: Request, res: Response, next: NextFunction) => {
    res.render('pages/queues.twig', {
        smsQueueTasksCount: smsQueue.getStats().total,
        emailQueueTasksCount: emailQueue.getStats().total,
    });
});
