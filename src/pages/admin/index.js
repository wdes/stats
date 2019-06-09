'use strict';
const githubAuth = require('@src/middlewares/github-auth');

app.get('/auth/github', githubAuth.passport.authenticate('github', { session: false }));
app.get(
    '/auth/github/callback',
    githubAuth.passport.authenticate('github', { session: false, failureRedirect: '/' }),
    function(req, res) {
        req.session.userId = req.user.id;
        req.session.githubUsername = req.user.username;
        res.redirect('/admin/');
    }
);
app.get('/admin/', githubAuth.isAuthenticated, (req, res, next) => {
    res.render('pages/admin/index.twig');
});
