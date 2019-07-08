'use strict';

import app from '@static/Express';
import { Request, Response, NextFunction } from 'express';
import schedule from '@lib/schedule';
import { AppMessage, AppMessageTypes } from '@lib/interfaces';

app.get('/admin/tasks', (req: Request, res: Response, next: NextFunction) => {
    app.once(AppMessageTypes.TASKS_LIST, (data: AppMessage) => {
        res.render('pages/admin/tasks.twig', {
            tasks: data.body,
        });
    });
    schedule.askForServersTasks();
});
