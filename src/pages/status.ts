'use strict';

import app from '@static/Express';

app.get('/status', (req, res) => {
    app.locals.requests.getServersStatus(app.locals.servers, serversStatus => {
        res.setHeader('Content-Type', 'text/plain');
        res.render('pages/status.twig', {
            servers: serversStatus,
        });
    });
});
