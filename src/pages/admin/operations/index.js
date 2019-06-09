'use strict';
const githubAuth = require('@src/middlewares/github-auth');

app.get('/admin/operations/', githubAuth.isAuthenticated, (req, res, next) => {
    res.render('pages/admin/operations/index.twig');
});
