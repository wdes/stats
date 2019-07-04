'use strict';

import app from '@static/Express';
import { Request, Response } from 'express';

app.get('/admin/', (req: Request, res: Response, next: Function) => {
    res.render('pages/admin/index.twig', {
        username: req.session!.githubUsername,
    });
});
