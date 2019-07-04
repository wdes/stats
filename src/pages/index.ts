'use strict';

import Servers from '@lib/Servers';
import app from '@static/Express';
import { Request, Response } from 'express';

app.get('/', (req: Request, res: Response) => {
    const loggedIn = typeof req.session!.githubUsername === 'string';
    if (loggedIn) {
        Servers.countServers().then(nbrServers => {
            Servers.countServers({
                where: { disabled: 1 },
            }).then(nbrDisabledServers => {
                res.render('pages/index.twig', {
                    loggedIn: loggedIn,
                    nbrServers: nbrServers,
                    nbrDisabledServers: nbrDisabledServers,
                });
            });
        });
    } else {
        res.render('pages/index.twig', {
            loggedIn: loggedIn,
        });
    }
});
