'use strict';

import app from '@static/Express';
import { Request, Response, NextFunction } from 'express';

app.get('/admin/', (req: Request, res: Response, next: NextFunction) => {
    res.render('pages/admin/index.twig', {
        username: req.session!.githubUsername,
    });
});
