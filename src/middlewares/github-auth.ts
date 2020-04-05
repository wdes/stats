'use strict';

import * as passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github';
import { Request, Response, NextFunction } from 'express';
const githubAdmins = process.env.GITHUB_ADMINS || '';

const githubUsers = githubAdmins.split(',').map((user) => user.trim());

const strategy = new GitHubStrategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
        callbackURL: process.env.GITHUB_CALLBACK_URL,
        passReqToCallback: true,
    },
    (req: Request, accessToken, refreshToken, profile, cb: (err: Error | null, data: any) => void) => {
        if (githubUsers.indexOf(profile.username || '') !== -1) {
            return cb(null, profile);
        } else {
            return cb(new Error('Not admin.'), null);
        }
    }
);

passport.use(strategy);

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (typeof req.session!.userId === 'string' && typeof req.session!.githubUsername === 'string') {
        if (githubUsers.indexOf(req.session!.githubUsername) !== -1) {
            return next();
        } else {
            req.session!.messages = [
                {
                    message: 'Not admin.',
                    level: 'danger',
                },
            ];
            return res.redirect('/login');
        }
    } else {
        req.session!.fromPath = req.url !== '/login' ? req.url : '/';
        req.session!.messages = [
            {
                message: 'Not connected.',
                level: 'warning',
            },
        ];
        return res.redirect('/login');
    }
};

export default {
    isAuthenticated,
    passport,
    strategy,
};
