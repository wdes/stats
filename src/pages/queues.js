'use strict';

app.get('/queues', (req, res, next) => {
    res.render('pages/queues.twig', {
        smsQueueTasksCount: smsQueue.getStats().total,
        emailQueueTasksCount: emailQueue.getStats().total,
    });
});
