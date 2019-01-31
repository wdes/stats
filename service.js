'use strict';

require('dotenv').config({ path: __dirname + '/../.env' });
const Service = require('node-linux').Service;

// Create a new service object
const svc = new Service({
    name: 'wdes-stats',
    description: 'WdesStats API server',
    author: 'WdesStats',
    mode: 'systemd',
    script: __dirname + '/server.js',
    user: process.env.SERVICE_USER,
    group: process.env.SERVICE_GROUP,
    env: {
        name: 'NODE_ENV',
        value: process.env.ENV,
    },
});

svc.on('install', function() {
    svc.start();
});
svc.on('start', function() {
    console.log('Starting service');
});
svc.on('stop', function() {
    console.log('Stopping service');
});
svc.on('doesnotexist', function() {
    svc.install();
});
svc.on('uninstall', function() {
    svc.install();
});

svc.uninstall();
