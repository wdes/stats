'use strict';

const Sms = require('@lib/Sms');
const githubAuth = require('@src/middlewares/github-auth');

app.get('/admin/operations/sendsms', githubAuth.isAuthenticated, (req, res, next) => {
    res.render('pages/admin/operations/sendsms.twig');
});

app.post('/admin/operations/sendsms', githubAuth.isAuthenticated, (req, res, next) => {
    let msg = '[wdes-stats][admin-operations][test]' + req.body.textToSend;
    if (req.body.sentToStack && req.body.sentToStack === 'true') {
        smsQueue.push('[queue] ' + msg);
    } else {
        Sms.sendSms('[direct] ' + msg);
    }
    res.redirect('/admin/operations/sendsms');
});
