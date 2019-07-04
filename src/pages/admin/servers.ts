'use strict';

const Servers = require('@lib/Servers');

app.get('/admin/servers', (req, res, next) => {
    Servers.listServers().then(servers => {
        res.render('pages/admin/servers.twig', {
            servers: servers,
        });
    });
});

app.post('/admin/servers/enable', (req, res, next) => {
    Servers.setDisabled(req.body.id, false).then(() => {
        res.redirect('/admin/servers');
    });
});

app.post('/admin/servers/disable', (req, res, next) => {
    Servers.setDisabled(req.body.id, true).then(() => {
        res.redirect('/admin/servers');
    });
});
