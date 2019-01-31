'use strict';

process.env.TZ = 'UTC';
require('module-alias/register');
const log4js = require('log4js');
log4js.configure({
    appenders: {
        out: { type: 'stdout' },
    },
    categories: { default: { appenders: ['out'], level: 'debug' } },
});
global.logger = log4js.getLogger('tests');
const stack = require('@test/stack');

suite('WdesStats', function() {
    stack();
}).beforeAll('Load ENV', done => {
    require('dotenv').config({ path: __dirname + '/../.env' });
    done();
});
