'use strict';


app.post('/azure/container/create', (req, res, next) => {
     global.blobService.createContainerIfNotExists(req.body.containerName, { publicAccessLevel: 'blob' }, err => {
        if (err) {
            next(err);
        } else {
            res.redirect(301, '/azure/containers');
        }
    });
});
