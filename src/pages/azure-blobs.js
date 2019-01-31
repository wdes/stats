'use strict';


app.get('/azure/blobs/:containerName', (req, res, next) => {
     global.blobService.listBlobsSegmented(req.params.containerName, null, (err, data) => {
        if (err) {
            next(err);
        } else {
            res.render('pages/azure/blobs.twig', {
                data: data,
                containerName: req.params.containerName
            });
            logger.debug({ message: `${data.entries.length} blobs`, blobs: data.entries });
        }
    });
});
