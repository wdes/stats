'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query(
            `CREATE PROCEDURE \`getMonitoringAvgTimes\`()
            READS SQL DATA
            COMMENT 'get monitoring avg times'
            SELECT
                \`id\`,
                \`url\`,
                \`name\`,
                getAvgTime(\`id\`) AS \`avgtime\`,
                getLastStatusCode(\`id\`) as \`lastStatusCode\`
                from \`monitoring__servers\`
            `
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query('DROP PROCEDURE getMonitoringAvgTimes');
    },
};
