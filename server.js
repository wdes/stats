'use strict';

require('dotenv').config({ path: __dirname + '/../.env' });
require('module-alias/register');

// Include the cluster module
global.cluster = require('cluster');
const log4js = require('log4js');
log4js.configure({
    appenders: {
        out: { type: 'stdout' },
    },
    categories: { default: { appenders: ['out'], level: 'debug' } },
});
let serverLogger = log4js.getLogger('server');
let queueLib = require('@lib/queue');
global.sequelize = require('@static/sequelize')(serverLogger);
global.smsQueue = queueLib.smsQueue(serverLogger);
global.emailQueue = queueLib.emailQueue(serverLogger);
const schedule = require('@lib/schedule');

var restartWorkers = true;
let logger; // jshint ignore:line

var workers = [];

if (cluster.isMaster) {
    // Code to run if we're in the master process
    process.title = 'M:WdesStats';
    var stdin = process.openStdin();
    const stopServer = function(allowRestart = false) {
        logger.debug('Received stop command !');
        restartWorkers = allowRestart;
        for (var workerId in cluster.workers) {
            if (cluster.workers[workerId].isDead() === false) {
                try {
                    cluster.workers[workerId].send({
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
    var cpuCount = require('os').cpus().length;
    for (var i = 0; i < cpuCount; i++) {
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
    schedule.init(logger, smsQueue);
    return;
} else if (cluster.isWorker) {
    process.title = 'W' + cluster.worker.id + ':WdesStats';
    logger = log4js.getLogger('api [' + cluster.worker.id + ']');
    global.logger = logger;
    //Workers code
    require('@src/main');
}
