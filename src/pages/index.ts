'use strict';

const Servers = require('@lib/Servers');

app.get('/', (req, res) => {
    const loggedIn = typeof req.session.githubUsername === 'string';
    if (loggedIn) {
        Servers.countServers().then(nbrServers => {
            Servers.countServers({
                where: { disabled: 1 },
            }).then(nbrDisabledServers => {
                res.render('pages/index.twig', {
                    loggedIn: loggedIn,
                    nbrServers: nbrServers,
                    nbrDisabledServers: nbrDisabledServers,
                });
            });
        });
    } else {
        res.render('pages/index.twig', {
            loggedIn: loggedIn,
        });
    }
});
