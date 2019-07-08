'use strict';

import app from '@static/Express';
import { Request, Response, NextFunction } from 'express';

app.get('/admin/', (req: Request, res: Response, next: NextFunction) => {
    const messages = req.session!.messages || [];
    req.session!.messages = [];
    res.render('pages/admin/index.twig', {
        messages: messages,
        username: req.session!.githubUsername,
    });
});
