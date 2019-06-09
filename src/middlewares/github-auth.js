'use strict';

const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
var githubAdmins = process.env.GITHUB_ADMINS || '';

const githubUsers = githubAdmins.split(',').map(user => user.trim());

const strategy = new GitHubStrategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
        passReqToCallback: true,
    },
    function(req, accessToken, refreshToken, profile, cb) {
        if (githubUsers.indexOf(profile.username) !== -1) {
            return cb(null, profile);
        } else {
            return cb(new Error('Not admin.'), null);
        }
    }
);

passport.use(strategy);

const isAuthenticated = (req, res, next) => {
    if (typeof req.session.userId === 'string' && typeof req.session.githubUsername === 'string') {
        if (githubUsers.indexOf(req.session.githubUsername) !== -1) {
            return next();
        } else {
            return next(new Error('Not admin.'));
        }
    } else {
        res.redirect('/?status=notauth');
    }
};

module.exports = {
    isAuthenticated,
    passport,
    strategy,
};
