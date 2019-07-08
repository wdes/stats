'use strict';

import Servers from '@lib/Servers';
import Status from '@lib/Status';
import Sms from '@lib/Sms';
import logger from '@util/logger';
import smsQueue from '@static/smsQueue';
import { ScheduledTask, validate, schedule } from 'node-cron';
import { MonitoringServerModel } from '@models/monitoring__servers';
import { AppMessage, AppMessageTypes } from './interfaces';
const serversTasks: {
    server: MonitoringServerModel;
    task: ScheduledTask;
    taskState: {
        destroyed: boolean;
        scheduled: boolean;
    };
}[] = [];
import * as cluster from 'cluster';

/**
 * Request and record a stat for a server
 * @param {Server} server The server object
 * @return {void}
 */
const recordStatForServer = server => {
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
                            .on('failed', (err): void => {
                                logger.error('task failed', err);
                            });
                        // {"name": "STATUS_CHANGED", "prevCode": "204", "actualCode": "200", "ts": 1548288000}
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
const scheduleServer = (server: MonitoringServerModel): void => {
    const scheduleRequest: AppMessage = {
        topic: AppMessageTypes.SCHEDULE_SERVER,
        body: server,
    };
    if (cluster.isMaster) {
        const serverSearch = serversTasks.find(obj => obj.server.id === server.id);
        if (serverSearch !== undefined) {
            serverSearch.task.start();
            serverSearch.taskState.scheduled = true;
        } else {
            if (validate(server.monitoringInterval)) {
                logger.debug(
                    'Server',
                    server.id,
                    ', scheduled:',
                    server.monitoringInterval,
                    ', enabled: ' + server.disabled
                );
                serversTasks.push({
                    task: schedule(
                        server.monitoringInterval,
                        () => {
                            recordStatForServer(server);
                        },
                        {
                            scheduled: server.disabled === false,
                        }
                    ),
                    server: server,
                    taskState: {
                        destroyed: false,
                        scheduled: server.disabled === false,
                    },
                });
            } else {
                logger.debug('Server', server.id, 'has a bad monitoring interval', server.monitoringInterval);
            }
        }
    } else {
        logger.info('Sending a request to master process', scheduleRequest);
        (process as any).send(scheduleRequest); // FIXME: bad hack
    }
};

const unScheduleServer = (server: MonitoringServerModel): void => {
    const unScheduleRequest: AppMessage = {
        topic: AppMessageTypes.UNSCHEDULE_SERVER,
        body: server,
    };
    if (cluster.isMaster) {
        const serverSearch = serversTasks.find(obj => obj.server.id === server.id);
        if (serverSearch !== undefined) {
            serverSearch.task.stop();
            serverSearch.taskState.scheduled = false;
        }
    } else {
        logger.info('Sending a request to master process', unScheduleRequest);
        (process as any).send(unScheduleRequest); // FIXME: bad hack
    }
};

const getTasks = () => {
    const serversTasksToSend: {
        server: MonitoringServerModel;
        taskState: {
            destroyed: boolean;
            scheduled: boolean;
        };
    }[] = [];
    serversTasks.forEach(serversTask => {
        serversTasksToSend.push({
            server: serversTask.server,
            taskState: serversTask.taskState,
        });
    });
    const tasksListResponse: AppMessage = {
        topic: AppMessageTypes.TASKS_LIST,
        body: serversTasksToSend,
    };
    return tasksListResponse;
};

const askForServersTasks = (): void => {
    if (cluster.isMaster === false) {
        const askForTasks: AppMessage = {
            topic: AppMessageTypes.ASK_TASKS_LIST,
        };
        // logger.debug('Sending a request to master process', askForTasks);
        (process as any).send(askForTasks); // FIXME: bad hack
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
