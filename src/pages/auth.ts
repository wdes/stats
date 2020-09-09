'use strict';
import githubAuth from '@middlewares/github-auth';
import app from '@static/Express';
import { Request, Response } from 'express';

app.get('/auth/github', githubAuth.passport.authenticate('github', { session: false }));
app.get(
    '/auth/github/callback',
    githubAuth.passport.authenticate('github', { session: false, failureRedirect: '/login' }),
    (req: Request, res: Response): void => {
        const session = (req as any).session;
        const user = (req as any).user;
        session.userId = user.id;
        session.githubUsername = user.username;
        res.redirect('/admin/');
    }
);

app.get('/login', (req: Request, res: Response) => {
    const session = (req as any).session;
    const messages = session.messages || [];
    (req as any).session = undefined;
    res.render('pages/login.twig', {
        messages: messages,
    });
});

app.get('/logout', (req: Request, res: Response) => {
    const session = (req as any).session;
    session.userId = null;
    session.githubUsername = null;
    session.messages = [
        {
            message: 'Loged out.',
            level: 'info',
        },
    ];
    res.redirect('/login');
});
