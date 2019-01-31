'use strict';

app.get('/azure/blob/:containerName/:blobName', (req, res, next) => {
    global.blobService.getBlobToText(
        req.params.containerName,
        req.params.blobName,
        (err, data) => {
            if (err) {
                next(err);
            } else {
                res.send(data);
                logger.debug({ message: `Blob downloaded "${data}"`, text: data });
            }
        }
    );
});
