'use strict';

import Servers from '@lib/Servers';
import Status from '@lib/Status';
import Sms from '@lib/Sms';
import logger from '@util/logger';
import smsQueue from '@static/smsQueue';
import { ScheduledTask, validate, schedule } from 'node-cron';
const serversTasks: ScheduledTask[] = [];

/**
 * Request and record a stat for a server
 * @param {Server} server The server object
 * @return {void}
 */
const recordStatForServer = function(server) {
    Status.getServerStatus(server.url, 'HEAD')
        .then(data => {
            Servers.recordStat(
                server.id,
                new Date().getTime() / 1000,
                data.response.timingPhases!.total,
                data.response.statusCode
            )
                .then((dataChanged: any) => {
                    if (dataChanged && dataChanged.name && dataChanged.name === 'STATUS_CHANGED') {
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
};

/**
 * Schedule a server
 * @param {Server} server The server object
 * @return {void}
 */
const scheduleServer = function(server) {
    if (validate(server.monitoringInterval)) {
        logger.debug('Server', server.id, 'scheduled:', server.monitoringInterval);
        serversTasks.push(
            schedule(server.monitoringInterval, () => {
                recordStatForServer(server);
            })
        );
    } else {
        logger.debug('Server', server.id, 'has a bad monitoring interval', server.monitoringInterval);
    }
};

export default {
    init: () => {
        Servers.listServers()
            .then(servers => {
                servers.forEach(server => {
                    scheduleServer(server);
                });
            })
            .catch(err => {
                logger.error(err);
            });
    },
    scheduleServer: scheduleServer,
    recordStatForServer: recordStatForServer,
    serversTasks: serversTasks,
};
