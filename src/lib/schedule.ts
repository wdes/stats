'use strict';

import Servers from '@lib/Servers';
import Status from '@lib/Status';
import Sms from '@lib/Sms';
import logger from '@util/logger';
import smsQueue from '@static/smsQueue';
import { ScheduledTask, validate, schedule } from 'node-cron';
import { MonitoringServerModel } from '@db/models/monitoring__servers';
import { AppMessage, AppMessageTypes } from './interfaces';
const serversTasks: {
    server: MonitoringServerModel;
    task: ScheduledTask;
}[] = [];
import * as cluster from 'cluster';

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
 * @param {MonitoringServerModel} server The server model
 * @return {void}
 */
const scheduleServer = function(server: MonitoringServerModel) {
    let scheduleRequest: AppMessage = {
        topic: AppMessageTypes.SCHEDULE_SERVER,
        body: server,
    };
    if (cluster.isMaster) {
        let serverSearch = serversTasks.find(obj => obj.server.id === server.id);
        if (serverSearch !== undefined) {
            serverSearch.task.start();
        } else {
            if (validate(server.monitoringInterval)) {
                logger.debug('Server', server.id, 'scheduled:', server.monitoringInterval);
                serversTasks.push({
                    task: schedule(server.monitoringInterval, () => {
                        recordStatForServer(server);
                    }),
                    server: server,
                });
            } else {
                logger.debug('Server', server.id, 'has a bad monitoring interval', server.monitoringInterval);
            }
        }
    } else {
        logger.info('Sending a request to master process', scheduleRequest);
        (<any>process).send(scheduleRequest); //FIXME: bad hack
    }
};

const unScheduleServer = function(server: MonitoringServerModel): void {
    let unScheduleRequest: AppMessage = {
        topic: AppMessageTypes.UNSCHEDULE_SERVER,
        body: server,
    };
    if (cluster.isMaster) {
        let serverSearch = serversTasks.find(obj => obj.server.id === server.id);
        if (serverSearch !== undefined) {
            serverSearch.task.stop();
        }
    } else {
        logger.info('Sending a request to master process', unScheduleRequest);
        (<any>process).send(unScheduleRequest); //FIXME: bad hack
    }
};

const getTasks = function() {
    let serversTasksToSend: {
        server: MonitoringServerModel;
    }[] = [];
    serversTasks.forEach(serversTask => {
        serversTasksToSend.push({
            server: serversTask.server,
        });
    });
    let tasksListResponse: AppMessage = {
        topic: AppMessageTypes.TASKS_LIST,
        body: serversTasksToSend,
    };
    return tasksListResponse;
};

const askForServersTasks = function(): void {
    if (cluster.isMaster === false) {
        let askForTasks: AppMessage = {
            topic: AppMessageTypes.ASK_TASKS_LIST,
        };
        //logger.debug('Sending a request to master process', askForTasks);
        (<any>process).send(askForTasks); //FIXME: bad hack
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
    askForServersTasks: askForServersTasks,
    getTasks: getTasks,
    scheduleServer: scheduleServer,
    unScheduleServer: unScheduleServer,
    recordStatForServer: recordStatForServer,
    serversTasks: serversTasks,
};
