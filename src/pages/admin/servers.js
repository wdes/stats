'use strict';

const Servers = require('@lib/Servers');
const githubAuth = require('@src/middlewares/github-auth');

app.get('/admin/servers', githubAuth.isAuthenticated, (req, res, next) => {
    Servers.listServers().then(servers => {
        res.render('pages/admin/servers.twig', {
            servers: servers,
        });
    });
});
