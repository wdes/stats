'use strict';

app.get('/', (req, res) => {
    res.render('pages/index.twig', {
        message: 'Hello World',
    });
});
