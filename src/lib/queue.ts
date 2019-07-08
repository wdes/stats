'use strict';

import * as BetterQueue from 'better-queue';
import { randomBytes } from 'crypto';
import Sms from '@lib/Sms';
import Email from '@lib/Email';
import stack from '@lib/stack';
import Queue, { QueueModel } from '@models/queue';
import logger from '@util/logger';

const takeNextN = function(first: boolean, groupName: string) {
    return (n: number, cb: (error: any, lockId: string) => void): void => {
        //(error: any, lockId: string)
        Queue.findAll({
            where: {
                lock: '',
                groupName: groupName,
            },
            order: [['priority', 'DESC'], ['added', first ? 'ASC' : 'DESC']],
            limit: n,
            attributes: ['id'],
        })
            .then((queues: QueueModel[]) => {
                let lockId = randomBytes(16).toString('hex');
                Queue.update(
                    {
                        lock: lockId,
                    },
                    {
                        where: {
                            lock: '',
                            groupName: groupName,
                            id: queues.map(queue => queue.id),
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

const getStore = function(groupName: string) {
    interface tasks {
        [lockId: string]: {
            [rowId: string]: string;
        };
    }
    const getRunningTasks = function(cb: (error: null, tasks: tasks) => void, data?: any): void {
        Queue.findAll({
            attributes: ['id', 'task', 'lock'],
            where: { groupName: groupName },
        })
            .then(function(rows) {
                var tasks: tasks = {};
                rows.forEach(function(row) {
                    if (!row.lock) {
                        return;
                    }
                    tasks[row.lock] = tasks[row.lock] || [];
                    tasks[row.lock][row.id] = JSON.parse(row.task);
                });
                cb(null, tasks);
            })
            .error(cb);
    };
    let store: BetterQueue.Store<string> = {
        connect: cb => {
            //connect(cb: (error: any, length: number) => void): void;
            Queue.count({
                where: {
                    groupName: groupName,
                },
            })
                .then(c => {
                    cb(null, c);
                })
                .catch(err => {
                    logger.error(err);
                    cb(err, 0);
                });
        },
        getTask: (taskId, cb) => {
            //getTask(taskId: any, cb: (error: any, task: T) => void): void;
            Queue.findOne({
                where: { id: taskId, groupName: groupName },
                attributes: ['task'],
            })
                .then(task => {
                    cb(null, JSON.parse(task.task));
                })
                .catch(err => {
                    logger.error(err);
                    cb(err, '');
                });
        },
        putTask: (taskId, task, priority, cb) => {
            //putTask(taskId: any, task: T, priority: number, cb: (error: any) => void): void;
            Queue.create({
                id: taskId,
                task: JSON.stringify(task),
                priority: priority || 1,
                lock: '',
                groupName: groupName,
            })
                .then(queue => {
                    cb(null);
                })
                .catch(err => {
                    logger.error(err);
                    cb(err);
                });
        },
        takeFirstN: takeNextN(true, groupName), //takeFirstN(n: number, cb: (error: any, lockId: string) => void): void;
        takeLastN: takeNextN(false, groupName), //takeLastN(n: number, cb: (error: any, lockId: string) => void): void;
        deleteTask: (taskId, cb) => {
            //deleteTask(taskId: any, cb: () => void): void;
            Queue.destroy({ where: { id: taskId, groupName: groupName } })
                .then(() => {
                    cb();
                })
                .catch(err => {
                    logger.error(err);
                    cb();
                });
        },
        getLock: (lockId, cb) => {
            //getLock(lockId: string, cb: (error: any, tasks: { [taskId: string]: T }) => void): void;
            Queue.findAll({ where: { lock: lockId, groupName: groupName } })
                .then(rows => {
                    var tasks = {};
                    rows.forEach(function(row) {
                        tasks[row.id] = JSON.parse(row.task);
                    });
                    cb(null, tasks);
                })
                .catch(err => {
                    logger.error(err);
                    cb(err, {});
                });
        },
        releaseLock: (lockId, cb) => {
            //releaseLock(lockId: string, cb: (error: any) => void): void;
            Queue.destroy({ where: { lock: lockId, groupName: groupName } })
                .then(() => {
                    cb(null);
                })
                .catch(err => {
                    logger.error(err);
                    cb(err);
                });
        },
    };
    let astore: any = store;
    astore.getRunningTasks = getRunningTasks;
    return astore;
};

export default {
    emailQueue: () => {
        let emailStack = stack();
        emailStack.init(
            10000,
            () => {
                //Tick callback
            },
            messages => {
                messages.forEach(message => {
                    Email.sendEmail(message).catch(err => {
                        logger.error(err);
                    });
                });
            }
        );
        return new BetterQueue(
            (input, cb) => {
                emailStack.addToStack(input);
                cb(null, {});
            },
            {
                batchSize: 1,
                concurrent: 1,
                filo: true,
                store: getStore('email'),
            }
        );
    },
    smsQueue: () => {
        let smsStack = stack();
        smsStack.init(
            1000,
            () => {
                //Tick callback
            },
            messages => {
                messages.forEach(message => {
                    Sms.sendSms(message)
                        .then(data => {
                            //localLogger.debug(data.response.statusCode, data.response.body);
                        })
                        .catch(err => {
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
