'use strict';

import sequelize from '@static/sequelize';
import { QueryTypes } from 'sequelize';
import MonitoringServers, { MonitoringServerModel } from '@models/monitoring__servers';

export default {
    lastStatusCode: (serverId: number) => {
        return new Promise((resolve, reject) => {
            sequelize.sequelize
                .query('SELECT getLastStatusCode(?) as `lastStatusCode`;', {
                    replacements: [serverId],
                    type: QueryTypes.SELECT,
                    plain: true,
                })
                .then(data => {
                    resolve(data.lastStatusCode);
                })
                .catch(err => reject(err));
        });
    },
    getMonitoringAvgTimes: () => {
        return new Promise((resolve, reject) => {
            sequelize.sequelize
                .query('CALL getMonitoringAvgTimes();', {
                    type: QueryTypes.SELECT,
                })
                .then(data => {
                    const serversTimes: object[] = [];
                    for (const key in data[0]) {
                        const element = data[0][key];
                        const server = {
                            idServer: element.id,
                            name: element.name,
                            avgTime: element.avgtime,
                            url: element.url,
                            lastStatusCode: element.lastStatusCode,
                        };
                        serversTimes.push(server);
                    }
                    resolve(serversTimes);
                })
                .catch(err => reject(err));
        });
    },
    getMonitoringTimes: (serverId: number) => {
        return new Promise((resolve, reject) => {
            sequelize.sequelize
                .query('CALL getMonitoringTimes(?);', {
                    replacements: [serverId],
                    type: QueryTypes.SELECT,
                })
                .then(data => {
                    const timesByDate: object[] = [];
                    for (const key in data[0]) {
                        const element = data[0][key];
                        timesByDate.push({
                            time: element.time,
                            totalTime: element.totalTime,
                        });
                    }
                    resolve(timesByDate);
                })
                .catch(err => reject(err));
        });
    },
    percentageOfStatusCodesByServer: (serverId: number) => {
        return new Promise((resolve, reject) => {
            sequelize.sequelize
                .query('CALL percentageOfStatusCodesByServer(?);', {
                    replacements: [serverId],
                    type: QueryTypes.SELECT,
                })
                .then(data => {
                    const percentagesByCodes: object[] = [];
                    for (const key in data[0]) {
                        const element = data[0][key];
                        percentagesByCodes.push({
                            value: element.percentage,
                            label: element.statusCode,
                        });
                    }
                    resolve(percentagesByCodes);
                })
                .catch(err => reject(err));
        });
    },
    serverExists: (serverId: number) => {
        return new Promise((resolve, reject) => {
            sequelize.sequelize
                .query('SELECT serverExists(?) as `exists`;', {
                    replacements: [serverId],
                    type: QueryTypes.SELECT,
                    plain: true,
                })
                .then(data => {
                    resolve(data.exists === 1);
                })
                .catch(err => reject(err));
        });
    },
    recordStat: (serverId: number, tstamp: number, totalTime: number, statusCodeIN: number) => {
        return new Promise((resolve, reject) => {
            sequelize.sequelize
                .query('CALL recordStat(?, FROM_UNIXTIME(?), ?, ?);', {
                    replacements: [serverId, tstamp, totalTime, statusCodeIN],
                })
                .then((data): void => {
                    resolve(data);
                })
                .catch(err => {
                    if (err.name && err.name === 'SequelizeDatabaseError' && err.parent) {
                        if (err.parent.sqlState && (err.parent.sqlState === 45000 || err.parent.sqlState === '45000')) {
                            try {
                                // #30001 - {"name": "STATUS_CHANGED", "prevCode": "204", "actualCode": "200", "ts": 1548288000}
                                resolve(JSON.parse(err.parent.sqlMessage));
                            } catch (error) {
                                reject(error);
                            }
                        } else {
                            reject(err);
                        }
                    } else {
                        reject(err);
                    }
                });
        });
    },
    listServers: (
        options = {
            raw: false,
        }
    ): Promise<MonitoringServerModel[]> => {
        return MonitoringServers.findAll(options);
    },
    countServers: (
        options = {
            where: { disabled: 0 },
        }
    ) => {
        return MonitoringServers.count(options);
    },
    addServer: (name, url, cron, disabled) => {
        return MonitoringServers.create({
            name: name,
            url: url,
            monitoringInterval: cron,
            disabled: disabled,
        });
    },
    setDisabled: (id, disabled) => {
        return MonitoringServers.update(
            {
                disabled: disabled,
            },
            { where: { id: id } }
        );
    },
};
