'use strict';
import githubAuth from '@src/middlewares/github-auth';
import app from '@static/Express';
import { Request, Response } from 'express';

app.get('/auth/github', githubAuth.passport.authenticate('github', { session: false }));
app.get(
    '/auth/github/callback',
    githubAuth.passport.authenticate('github', { session: false, failureRedirect: '/login' }),
    (req: Request, res: Response): void => {
        req.session!.userId = req.user.id;
        req.session!.githubUsername = req.user.username;
        res.redirect('/admin/');
    }
);

app.get('/login', (req: Request, res: Response) => {
    const messages = req.session!.messages || [];
    req.session = undefined;
    res.render('pages/login.twig', {
        messages: messages,
    });
});

app.get('/logout', (req: Request, res: Response) => {
    req.session!.userId = null;
    req.session!.githubUsername = null;
    req.session!.messages = [
        {
            message: 'Loged out.',
            level: 'info',
        },
    ];
    res.redirect('/login');
});
