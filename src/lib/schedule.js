'use strict';

const Servers = require('@lib/Servers');
const Status = require('@lib/Status');
const Sms = require('@lib/Sms');
const cron = require('node-cron');
const serversTasks = [];

module.exports = {
    init: (logger, smsQueue) => {
        //smsQueue.push('Démarrage du worker n°'+cluster.worker.id);
        //emailQueue.push('Démarrage du worker n°'+cluster.worker.id);
        //queue.push('Démarrage du worker n°'+cluster.worker.id);
        Servers.listServers()
            .then(servers => {
                servers.forEach(server => {
                    if (cron.validate(server.monitoringInterval)) {
                        logger.debug(
                            'Server',
                            server.id,
                            'scheduled:',
                            server.monitoringInterval
                        );
                        serversTasks.push(
                            cron.schedule(server.monitoringInterval, () => {
                                Status.getServerStatus(server.url, 'HEAD')
                                    .then((response, body) => {
                                        Servers.recordStat(
                                            server.id,
                                            parseInt(new Date().getTime() / 1000),
                                            response.timingPhases.total,
                                            response.statusCode
                                        )
                                            .then(dataChanged => {
                                                if (
                                                    dataChanged &&
                                                    dataChanged.name &&
                                                    dataChanged.name === 'STATUS_CHANGED'
                                                ) {
                                                    logger.warn(smsQueue.getStats());
                                                    smsQueue
                                                        .push(
                                                            Sms.smsChangeStatusCode(
                                                                server.name,
                                                                dataChanged.prevCode,
                                                                dataChanged.actualCode,
                                                                dataChanged.ts
                                                            )
                                                        )
                                                        .on('failed', function(err) {
                                                            logger.error('task failed', err);
                                                        });
                                                    //{"name": "STATUS_CHANGED", "prevCode": "204", "actualCode": "200", "ts": 1548288000}
                                                }
                                            })
                                            .catch(err => {
                                                logger.error(err);
                                            });
                                    })
                                    .catch(err => {
                                        logger.error(err);
                                    });
                            })
                        );
                    } else {
                        logger.debug(
                            'Server',
                            server.id,
                            'has a bad monitoring interval',
                            server.monitoringInterval
                        );
                    }
                });
            })
            .catch(err => {
                logger.error(err);
            });
    },
    serversTasks: serversTasks,
};
