'use strict';

import * as BetterQueue from 'better-queue';
import { randomBytes } from 'crypto';
import Sms from '@lib/Sms';
import stack from '@lib/stack';
import Queue from '@models/queue';
import logger from '@util/logger';

const takeNextN = function(first, groupName) {
    return function(n, cb) {
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
            .then(ids => {
                let lockId = randomBytes(16).toString('hex');
                Queue.update(
                    {
                        lock: lockId,
                    },
                    {
                        where: {
                            lock: '',
                            groupName: groupName,
                            id: ids.map(ids => ids.id),
                        },
                        fields: ['lock'],
                    }
                )
                    .then(infos => {
                        // affectedCount, affectedRows
                        cb(null, infos[0] > 0 ? lockId : '');
                    })
                    .catch(cb);
            })
            .catch(cb);
    };
};

const getStore = function(groupName) {
    return {
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
                .catch(cb);
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
                .catch(cb);
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
                .then(() => {
                    cb(null);
                })
                .catch(cb);
        },
        takeFirstN: takeNextN(true, groupName), //takeFirstN(n: number, cb: (error: any, lockId: string) => void): void;
        takeLastN: takeNextN(false, groupName), //takeLastN(n: number, cb: (error: any, lockId: string) => void): void;
        deleteTask: (taskId, cb) => {
            //deleteTask(taskId: any, cb: () => void): void;
            Queue.destroy({ where: { id: taskId, groupName: groupName } })
                .then(() => {
                    cb(null);
                })
                .catch(cb);
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
                .error(cb);
        },
        releaseLock: (lockId, cb) => {
            //releaseLock(lockId: string, cb: (error: any) => void): void;
            Queue.destroy({ where: { lock: lockId, groupName: groupName } })
                .then(() => {
                    cb(null);
                })
                .catch(cb);
        },
        getRunningTasks: function(cb) {
            Queue.findAll({
                attributes: ['id', 'task', 'lock'],
                where: { groupName: groupName },
            })
                .then(function(rows) {
                    var tasks = {};
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
        },
    };
};

export default {
    emailQueue: () => {
        let emailStack = stack();
        emailStack.init(
            1000,
            () => {
                //Tick callback
            },
            messages => {
                messages.forEach(message => {
                    //TODO: implement email sending
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
