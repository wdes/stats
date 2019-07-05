'use strict';
import app from '@static/Express';
import { Request, Response } from 'express';

app.get('/admin/operations/', (req: Request, res: Response, next: Function) => {
    res.render('pages/admin/operations/index.twig');
});