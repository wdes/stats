'use strict';
import app from '@static/Express';
import { Request, Response, NextFunction } from 'express';

app.get('/admin/operations/', (req: Request, res: Response, next: NextFunction) => {
    res.render('pages/admin/operations/index.twig');
});
