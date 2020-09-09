'use strict';

import app from '@static/Express';
import { Request, Response, NextFunction } from 'express';

app.get('/admin/', (req: Request, res: Response, next: NextFunction) => {
    const session = (req as any).session;
    const messages = session.messages || [];
    session.messages = [];
    res.render('pages/admin/index.twig', {
        messages: messages,
        username: session.githubUsername,
    });
});
