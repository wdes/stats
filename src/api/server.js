'use strict';

const Servers = require('@lib/Servers');

const serverExists = require('@middlewares/serverExists');

/**
 * @api {get} /api/01/server/lastStatusCode Get last status code
 * @apiGroup Api
 * @apiPermission public
 * @apiVersion 1.0.0
 * @apiSuccess (200) {Integer} statusCode The last status code
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "statusCode": 200
 *    }
 */
app.get('/api/10/server/lastStatusCode', serverExists('query', 'id'), function(req, res, next) {
    Servers.lastStatusCode(req.query.id)
        .then(statusCode => {
            res.send({ statusCode: statusCode });
        })
        .catch(err => next(err));
});
