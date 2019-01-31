'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query(
            `CREATE PROCEDURE \`getMonitoringAvgTimes\`()
            READS SQL DATA
            COMMENT 'get monitoring avg times'
            SELECT
                \`monitoring__servers\`.\`id\`,
                \`monitoring__servers\`.\`url\`,
                \`monitoring__servers\`.\`name\`,
                round(avg(\`monitoring__times\`.\`totalTime\`),0) AS \`avgtime\`,
                getLastStatusCode(\`monitoring__servers\`.\`id\`) as \`lastStatusCode\`
                from (\`monitoring__servers\` join \`monitoring__times\`)
                where (\`monitoring__servers\`.\`id\` = \`monitoring__times\`.\`idServer\`)
                group by \`monitoring__servers\`.\`id\`
            `
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query('DROP PROCEDURE getMonitoringAvgTimes');
    },
};
