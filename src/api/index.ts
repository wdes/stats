'use strict';

import app from '@static/Express';
import { Request, Response } from 'express';

/**
 * @api {get} /api/10/api/index The api status
 * @apiGroup Api
 * @apiPermission public
 * @apiVersion 1.0.0
 * @apiSuccess (200) {String} status The api status
 * @apiSuccess (200) {String} description The api description
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "status": "online",
 *      "description": "WdesStats API"
 *    }
 */
app.get('/api/10/api/index', (req: Request, res: Response): void => {
    res.send({ status: 'online', description: 'WdesStats API' });
});

/**
 * @api {get} /api/10/api/stop Stop the server
 * @apiGroup Api
 * @apiPermission admin
 * @apiVersion 1.0.0
 * @apiUse 202AcceptedSuccess
 */
app.get('/api/10/api/stop', (req: Request, res: Response): void => {
    app.emit('appStop');
    res.send({});
});
