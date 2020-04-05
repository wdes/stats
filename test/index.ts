'use strict';

process.env.TZ = 'UTC';
require('module-alias')(__dirname + '/../');
import stack from '@test/stack';
import logger from '@test/logger';

suite('WdesStats', () => {
    stack();
    logger();
}).beforeAll('Load ENV', (done) => {
    require('dotenv').config({ path: __dirname + '/../.env' });
    done();
});
