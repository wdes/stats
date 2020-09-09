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
    const session = (req as any).session;
    const url = (req as any).url;
    if (typeof session.userId === 'string' && typeof session.githubUsername === 'string') {
        if (githubUsers.indexOf(session.githubUsername) !== -1) {
            return next();
        } else {
            session.messages = [
                {
                    message: 'Not admin.',
                    level: 'danger',
                },
            ];
            return res.redirect('/login');
        }
    } else {
        session.fromPath = url !== '/login' ? url : '/';
        session.messages = [
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
