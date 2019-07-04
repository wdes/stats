'use strict';

app.get('/admin/', (req, res, next) => {
    res.render('pages/admin/index.twig', {
        username: req.session.githubUsername,
    });
});
