'use strict';

const githubAuth = require('@src/middlewares/github-auth');

app.get('/queues', githubAuth.isAuthenticated, (req, res, next) => {
    res.render('pages/queues.twig', {
        smsQueueTasksCount: smsQueue.getStats().total,
        emailQueueTasksCount: emailQueue.getStats().total,
    });
});
