'use strict';

require('dotenv').config({ path: __dirname + '/../.env' });
require('module-alias')(__dirname);

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
import { AppMessage, AppMessageTypes } from '@lib/interfaces';

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
            let worker = cluster.workers[workerId];
            if (worker !== undefined) {
                if (worker.isDead() === false && worker.isConnected()) {
                    try {
                        let appMessage: AppMessage = {
                            topic: AppMessageTypes.APP_STOP,
                        };
                        worker.send(appMessage);
                        //cluster.workers[workerId].kill();
                    } catch (error) {}
                }
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
        let thread = cluster.fork();
        thread.on('message', (data: AppMessage) => {
            if (typeof data === 'object') {
                switch (data.topic) {
                    case AppMessageTypes.SCHEDULE_SERVER:
                        logger.debug('Received ', data.topic, ' from ', thread.id);
                        schedule.scheduleServer(data.body);
                        break;
                    case AppMessageTypes.UNSCHEDULE_SERVER:
                        logger.debug('Received ', data.topic, ' from ', thread.id);
                        schedule.unScheduleServer(data.body);
                        break;
                    case AppMessageTypes.ASK_TASKS_LIST:
                        logger.debug('Received ', data.topic, ' from ', thread.id);
                        let worker = cluster.workers[thread.id];
                        if (worker !== undefined) {
                            if (worker.isDead() === false && worker.isConnected()) {
                                worker.send(schedule.getTasks());
                            }
                        }
                        break;
                }
            }
        });
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
