'use strict';

const Servers = require('@lib/Servers');
const schedule = require('@lib/schedule');
const githubAuth = require('@src/middlewares/github-auth');

app.get('/admin/addserver', githubAuth.isAuthenticated, (req, res, next) => {
    res.render('pages/admin/addserver.twig');
});

app.post('/admin/addserver', githubAuth.isAuthenticated, (req, res, next) => {
    const isDisabled = typeof req.body.disabled === 'string' && req.body.disabled === 'true';
    Servers.addServer(req.body.name, req.body.url, req.body.cron, isDisabled)
        .then(server => {
            smsQueue.push(
                '[wdes-stats][admin][new-server] Added server: ' +
                    server.name +
                    ', url: ' +
                    server.url +
                    ', cron: ' +
                    server.cron +
                    ', disabled: ' +
                    isDisabled
            );
            if (!isDisabled) {
                schedule.recordStatForServer(logger, server);
            }
            res.redirect('/admin/servers');
        })
        .catch(next);
});
