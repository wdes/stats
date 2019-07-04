'use strict';

const Queue = require('better-queue');
const crypto = require('crypto');
const Sms = require('@lib/Sms');
const stack = require('@lib/stack');

const takeNextN = function(first, groupName) {
    return function(n, cb) {
        //(error: any, lockId: string)
        sequelize.queue
            .findAll({
                where: {
                    lock: '',
                    groupName: groupName,
                },
                order: [['priority', 'DESC'], ['added', first ? 'ASC' : 'DESC']],
                limit: n,
                attributes: ['id'],
            })
            .then(ids => {
                let lockId = crypto.randomBytes(16).toString('hex');
                sequelize.queue
                    .update(
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
            sequelize.queue
                .count({
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
            sequelize.queue
                .findOne({
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
            sequelize.queue
                .create({
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
            sequelize.queue
                .destroy({ where: { id: taskId, groupName: groupName } })
                .then(() => {
                    cb(null);
                })
                .catch(cb);
        },
        getLock: (lockId, cb) => {
            //getLock(lockId: string, cb: (error: any, tasks: { [taskId: string]: T }) => void): void;
            sequelize.queue
                .findAll({ where: { lock: lockId, groupName: groupName } })
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
            sequelize.queue
                .destroy({ where: { lock: lockId, groupName: groupName } })
                .then(() => {
                    cb(null);
                })
                .catch(cb);
        },
        getRunningTasks: function(cb) {
            sequelize.queue
                .findAll({
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

module.exports = {
    emailQueue: localLogger => {
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
        return new Queue(
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
    smsQueue: localLogger => {
        let smsStack = stack();
        smsStack.init(
            1000,
            () => {
                //Tick callback
            },
            messages => {
                messages.forEach(message => {
                    Sms.sendSms(message)
                        .then((response, body) => {
                            //localLogger.debug(response.statusCode, response.body);
                        })
                        .catch(err => {
                            localLogger.error(err);
                        });
                });
            }
        );
        return new Queue(
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
