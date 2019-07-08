'use strict';

import logger from '@util/logger';

export default () => {
    suite('logger', function() {
        test('Test logger calls', done => {
            logger.debug('ok');
            logger.info('ok ok');
            done();
        });
    });
};
