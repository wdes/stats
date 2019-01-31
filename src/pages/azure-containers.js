'use strict';


app.get('/azure/containers', (req, res, next) => {
     global.blobService.listContainersSegmented(null, (err, data) => {
        if (err) {
            next(err);
        } else {
            res.render('pages/azure/containers.twig', {
                data: data
            });
            logger.debug({ message: `${data.entries.length} containers`, containers: data.entries });
        }
    });
});
