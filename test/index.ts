'use strict';

process.env.TZ = 'UTC';
require('module-alias/register');
import stack from '@test/stack';

suite('WdesStats', function() {
    stack();
}).beforeAll('Load ENV', done => {
    require('dotenv').config({ path: __dirname + '/../.env' });
    done();
});
