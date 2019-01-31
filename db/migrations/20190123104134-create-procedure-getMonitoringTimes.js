'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query(
            `CREATE PROCEDURE \`getMonitoringTimes\`(IN \`idServerIN\` INT(11) UNSIGNED)
            READS SQL DATA
            COMMENT 'getMonitoringTimes'
            SELECT monitoring__times.time, round(monitoring__times.totalTime, 0) as \`totalTime\`
            FROM monitoring__times WHERE monitoring__times.idServer = idServerIN AND \`time\` >= DATE_ADD(CURRENT_TIMESTAMP, INTERVAL -24 HOUR)`
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query('DROP PROCEDURE getMonitoringTimes');
    },
};
