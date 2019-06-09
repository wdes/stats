'use strict';

module.exports = {
    lastStatusCode: function(serverId) {
        return new Promise((resolve, reject) => {
            sequelize.sequelize
                .query('SELECT getLastStatusCode(?) as `lastStatusCode`;', {
                    replacements: [serverId],
                    type: sequelize.QueryTypes.SELECT,
                    plain: true,
                })
                .then(function(data) {
                    resolve(data.lastStatusCode);
                })
                .catch(err => reject(err));
        });
    },
    getMonitoringAvgTimes: function() {
        return new Promise((resolve, reject) => {
            sequelize.sequelize
                .query('CALL getMonitoringAvgTimes();', {
                    type: sequelize.QueryTypes.SELECT,
                })
                .then(function(data) {
                    var serversTimes = [];
                    for (var key in data[0]) {
                        let element = data[0][key];
                        let server = {
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
    getMonitoringTimes: function(serverId) {
        return new Promise((resolve, reject) => {
            sequelize.sequelize
                .query('CALL getMonitoringTimes(?);', {
                    replacements: [serverId],
                    type: sequelize.QueryTypes.SELECT,
                })
                .then(function(data) {
                    const timesByDate = [];
                    for (var key in data[0]) {
                        let element = data[0][key];
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
    percentageOfStatusCodesByServer: function(serverId) {
        return new Promise((resolve, reject) => {
            sequelize.sequelize
                .query('CALL percentageOfStatusCodesByServer(?);', {
                    replacements: [serverId],
                    type: sequelize.QueryTypes.SELECT,
                })
                .then(function(data) {
                    const percentagesByCodes = [];
                    for (var key in data[0]) {
                        let element = data[0][key];
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
    serverExists: function(serverId) {
        return new Promise((resolve, reject) => {
            sequelize.sequelize
                .query('SELECT serverExists(?) as `exists`;', {
                    replacements: [serverId],
                    type: sequelize.QueryTypes.SELECT,
                    plain: true,
                })
                .then(function(data) {
                    resolve(data.exists === 1);
                })
                .catch(err => reject(err));
        });
    },
    recordStat: function(serverId, tstamp, totalTime, statusCodeIN) {
        return new Promise((resolve, reject) => {
            sequelize.sequelize
                .query('CALL recordStat(?, FROM_UNIXTIME(?), ?, ?);', {
                    replacements: [serverId, tstamp, totalTime, statusCodeIN],
                })
                .then(function(data) {
                    resolve(data);
                })
                .catch(err => {
                    if (err.name && err.name === 'SequelizeDatabaseError' && err.parent) {
                        if (err.parent.sqlState && err.parent.sqlState == 45000) {
                            try {
                                //#30001 - {"name": "STATUS_CHANGED", "prevCode": "204", "actualCode": "200", "ts": 1548288000}
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
    listServers: function(
        options = {
            raw: true,
        }
    ) {
        return sequelize.monitoring__servers.findAll(options);
    },
    countServers: function(
        options = {
            where: { disabled: 0 },
        }
    ) {
        return sequelize.monitoring__servers.count(options);
    },
    addServer: function(name, url, cron, disabled) {
        return sequelize.monitoring__servers.create({
            name: name,
            url: url,
            monitoringInterval: cron,
            disabled: disabled,
        });
    },
};
