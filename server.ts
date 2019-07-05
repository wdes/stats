'use strict';

require('dotenv').config({ path: __dirname + '/../.env' });
const moduleAlias = require('module-alias')(__dirname);

// Include the cluster module
import * as cluster from 'cluster';
import * as log4js from 'log4js';
import { cpus } from 'os';
log4js.configure({
    appenders: {
        out: { type: 'stdout' },
    },
    categories: { default: { appenders: ['out'], level: 'debug' } },
});

import schedule from '@lib/schedule';

var restartWorkers = true;

var workers: cluster.Worker[] = [];

if (cluster.isMaster) {
    // Code to run if we're in the master process
    process.title = 'M:WdesStats';
    let logger = log4js.getLogger('server');
    var stdin = process.openStdin();
    const stopServer = function(allowRestart = false) {
        logger.debug('Received stop command !');
        restartWorkers = allowRestart;
        for (var workerId in cluster.workers) {
            if (cluster.workers[workerId]!.isDead() === false) {
                try {
                    cluster.workers[workerId]!.send({
                        type: 'appStop',
                    });
                    //cluster.workers[workerId].kill();
                } catch (error) {}
            }
        }
    };
    process.on('SIGTERM', function() {
        logger.debug('Received SIGTERM');
        stopServer();
    });
    process.on('SIGINT', function() {
        logger.debug('Received SIGINT');
        stopServer();
    });
    stdin.addListener('data', function(d) {
        // note:  d is an object, and when converted to a string it will
        // end with a linefeed.  so we (rather crudely) account for that
        // with toString() and then trim()

        var input_str = d.toString().trim();
        const args = input_str.split(' ');
        switch (args[0]) {
            case 'reload':
                stopServer(true);
                break;
            case 'stop':
                stopServer();
                break;
        }
    });
    logger = log4js.getLogger('master');
    for (var i = 0; i < cpus().length; i++) {
        var thread = cluster.fork();
        workers.push(thread);
    }
    cluster.on('exit', (worker, code, signal) => {
        logger.info(
            'worker %d died (%s). ' + (restartWorkers ? 'restarting...' : ''),
            worker.process.pid,
            signal || code
        );
        if (restartWorkers) {
            workers.push(cluster.fork());
        }
        var nbr = 0;
        for (var workerId in workers) {
            //Count alive workers
            if (workers[workerId].isDead() === false) {
                nbr++;
            }
        }
        if (nbr === 0) {
            //Everybody dead, kill master process.
            cluster.disconnect(function() {
                logger.info('Exit main process');
                log4js.shutdown(() => {
                    process.exit(0);
                });
            });
        }
    });
    logger.info('master is done', process.pid);
    schedule.init();
} else if (cluster.isWorker) {
    process.title = 'W' + cluster.worker.id + ':WdesStats';
    //Workers code
    require('@src/main');
}
