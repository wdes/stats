'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        // SET GLOBAL log_bin_trust_function_creators = 1;
        return queryInterface.sequelize.query(
            `CREATE FUNCTION \`getLastStatusCode\`(\`idServerIN\` INT(11) UNSIGNED)
            RETURNS smallint(6) unsigned READS SQL DATA
            COMMENT 'getLastStatusCode'
            RETURN (SELECT \`statusCode\` FROM \`monitoring__status-codes\`  WHERE \`idServer\` = idServerIN ORDER BY \`time\` DESC LIMIT 1)
            `
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query('DROP FUNCTION getLastStatusCode');
    },
};
