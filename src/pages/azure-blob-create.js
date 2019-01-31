'use strict';


app.post('/azure/blob/create', (req, res, next) => {
    logger.warn(req.body);
     global.blobService.createBlockBlobFromText(req.body.containerName, req.body.blobName, req.body.blobContent, err => {
        if (err) {
            next(err);
        } else {
            res.redirect(301, '/azure/blobs/'+req.body.containerName);
        }
    });
});
