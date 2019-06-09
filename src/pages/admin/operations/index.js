'use strict';

app.get('/admin/operations/', (req, res, next) => {
    res.render('pages/admin/operations/index.twig');
});
