'use strict';
const githubAuth = require('@src/middlewares/github-auth');

app.get('/auth/github', githubAuth.passport.authenticate('github', { session: false }));
app.get(
    '/auth/github/callback',
    githubAuth.passport.authenticate('github', { session: false, failureRedirect: '/login' }),
    function(req, res) {
        req.session.userId = req.user.id;
        req.session.githubUsername = req.user.username;
        res.redirect('/admin/');
    }
);

app.get('/login', (req, res) => {
    const messages = req.session.messages || [];
    req.session = null;
    res.render('pages/login.twig', {
        messages: messages,
    });
});

app.get('/logout', (req, res) => {
    req.session.userId = null;
    req.session.githubUsername = null;
    req.session.messages = [
        {
            message: 'Loged out.',
            level: 'info',
        },
    ];
    res.redirect('/login');
});
