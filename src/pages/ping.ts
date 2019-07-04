'use strict';

import app from '@static/Express';

app.get('/ping', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.render('pages/pong.twig');
});
