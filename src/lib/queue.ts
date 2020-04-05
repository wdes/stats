'use strict';

import * as BetterQueue from 'better-queue';
import { randomBytes } from 'crypto';
import Sms from '@lib/Sms';
import stack from '@lib/stack';
import Queue, { QueueModel } from '@models/queue';
import logger from '@util/logger';

const takeNextN = (first: boolean, groupName: string) => {
    return (n: number, cb: (error: any, lockId: string) => void): void => {
        // (error: any, lockId: string)
        Queue.findAll({
            where: {
                lock: '',
                groupName: groupName,
            },
            order: [
                ['priority', 'DESC'],
                ['added', first ? 'ASC' : 'DESC'],
            ],
            limit: n,
            attributes: ['id'],
        })
            .then((queues: QueueModel[]) => {
                const lockId = randomBytes(16).toString('hex');
                Queue.update(
                    {
                        lock: lockId,
                    },
                    {
                        where: {
                            lock: '',
                            groupName: groupName,
                            id: queues.map((queue) => queue.id),
                        },
                        fields: ['lock'],
                    }
                )
                    .then((infos: number[]) => {
                        // affectedCount, affectedRows
                        cb(null, infos[0] > 0 ? lockId : '');
                    })
                    .catch(cb);
            })
            .catch(cb);
    };
};

export const getStore = (groupName: string) => {
    interface Tasks {
        [lockId: string]: {
            [rowId: string]: string;
        };
    }
    const getRunningTasks = (cb: (error: null, tasks: Tasks) => void, data?: any): void => {
        Queue.findAll({
            attributes: ['id', 'task', 'lock'],
            where: { groupName: groupName },
        })
            .then((rows) => {
                const runningTasks: Tasks = {};
                rows.forEach((row) => {
                    if (!row.lock) {
                        return;
                    }
                    runningTasks[row.lock] = runningTasks[row.lock] || [];
                    runningTasks[row.lock][row.id] = JSON.parse(row.task);
                });
                cb(null, runningTasks);
            })
            .error(cb);
    };
    const store: BetterQueue.Store<string> = {
        connect: (cb) => {
            // connect(cb: (error: any, length: number) => void): void;
            Queue.count({
                where: {
                    groupName: groupName,
                },
            })
                .then((c) => {
                    cb(null, c);
                })
                .catch((err) => {
                    logger.error(err);
                    cb(err, 0);
                });
        },
        getTask: (taskId, cb) => {
            // getTask(taskId: any, cb: (error: any, task: T) => void): void;
            Queue.findOne({
                where: { id: taskId, groupName: groupName },
                attributes: ['task'],
            })
                .then((task) => {
                    cb(null, JSON.parse(task.task));
                })
                .catch((err) => {
                    logger.error(err);
                    cb(err, '');
                });
        },
        putTask: (taskId, task, priority, cb) => {
            // putTask(taskId: any, task: T, priority: number, cb: (error: any) => void): void;
            Queue.create({
                id: taskId,
                task: JSON.stringify(task),
                priority: priority || 1,
                lock: '',
                groupName: groupName,
            })
                .then((queue) => {
                    cb(null);
                })
                .catch((err) => {
                    logger.error(err);
                    cb(err);
                });
        },
        takeFirstN: takeNextN(true, groupName), // takeFirstN(n: number, cb: (error: any, lockId: string) => void): void;
        takeLastN: takeNextN(false, groupName), // takeLastN(n: number, cb: (error: any, lockId: string) => void): void;
        deleteTask: (taskId, cb) => {
            // deleteTask(taskId: any, cb: () => void): void;
            Queue.destroy({ where: { id: taskId, groupName: groupName } })
                .then(() => {
                    cb();
                })
                .catch((err) => {
                    logger.error(err);
                    cb();
                });
        },
        getLock: (lockId, cb) => {
            // getLock(lockId: string, cb: (error: any, tasks: { [taskId: string]: T }) => void): void;
            Queue.findAll({ where: { lock: lockId, groupName: groupName } })
                .then((rows) => {
                    const tasks = {};
                    rows.forEach((row) => {
                        tasks[row.id] = JSON.parse(row.task);
                    });
                    cb(null, tasks);
                })
                .catch((err) => {
                    logger.error(err);
                    cb(err, {});
                });
        },
        releaseLock: (lockId, cb) => {
            // releaseLock(lockId: string, cb: (error: any) => void): void;
            Queue.destroy({ where: { lock: lockId, groupName: groupName } })
                .then(() => {
                    cb(null);
                })
                .catch((err) => {
                    logger.error(err);
                    cb(err);
                });
        },
    };
    const astore: any = store;
    astore.getRunningTasks = getRunningTasks;
    return astore;
};

export default {
    smsQueue: () => {
        const smsStack = stack();
        smsStack.init(
            1000,
            () => {
                // Tick callback
            },
            (messages) => {
                messages.forEach((message) => {
                    Sms.sendSms(message)
                        .then((data) => {
                            // localLogger.debug(data.response.statusCode, data.response.body);
                        })
                        .catch((err) => {
                            logger.error(err);
                        });
                });
            }
        );
        return new BetterQueue(
            (input, cb) => {
                smsStack.addToStack(input);
                cb(null, {});
            },
            {
                batchSize: 1,
                concurrent: 1,
                filo: true,
                store: getStore('sms'),
            }
        );
    },
};
