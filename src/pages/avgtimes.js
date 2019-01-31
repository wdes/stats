'use strict';

const Servers = require('@lib/Servers');

app.get('/avgtimes', (req, res, next) => {
    Servers.getMonitoringAvgTimes()
        .then(avgtimes => {
            res.render('pages/avgtimes.twig', {
                servers: avgtimes,
            });
        })
        .catch(err => next(err));
});
