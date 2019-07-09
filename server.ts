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

let restartWorkers = true;

const workers: cluster.Worker[] = [];

if (cluster.isMaster) {
    // Code to run if we're in the master process
    process.title = 'M:WdesStats';
    let logger = log4js.getLogger('server');
    const stdin = process.openStdin();
    const stopServer = (allowRestart: boolean = false): void => {
        logger.debug('Received stop command !');
        restartWorkers = allowRestart;
        for (const workerId in cluster.workers) {
            const worker = cluster.workers[workerId];
            if (worker !== undefined) {
                if (worker.isDead() === false && worker.isConnected()) {
                    try {
                        const appMessage: AppMessage = {
                            topic: AppMessageTypes.APP_STOP,
                        };
                        worker.send(appMessage);
                        // cluster.workers[workerId].kill();
                    } catch (error) {}
                }
            }
        }
    };
    process.on('SIGTERM', () => {
        logger.debug('Received SIGTERM');
        stopServer();
    });
    process.on('SIGINT', () => {
        logger.debug('Received SIGINT');
        stopServer();
    });
    stdin.addListener('data', d => {
        // note:  d is an object, and when converted to a string it will
        // end with a linefeed.  so we (rather crudely) account for that
        // with toString() and then trim()

        const inputStr = d.toString().trim();
        const args = inputStr.split(' ');
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
    for (const _ of cpus()) {
        const thread = cluster.fork();
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
                        const worker = cluster.workers[thread.id];
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
        let nbr = 0;
        for (const workerId in workers) {
            // Count alive workers
            if (workers[workerId].isDead() === false) {
                nbr++;
            }
        }
        if (nbr === 0) {
            // Everybody dead, kill master process.
            cluster.disconnect(() => {
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
    // Workers code
    require('@src/main');
}
