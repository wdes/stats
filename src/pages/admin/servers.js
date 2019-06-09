'use strict';

const Servers = require('@lib/Servers');

app.get('/admin/servers', (req, res, next) => {
    Servers.listServers().then(servers => {
        res.render('pages/admin/servers.twig', {
            servers: servers,
        });
    });
});
