'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        // SET GLOBAL log_bin_trust_function_creators = 1;
        return queryInterface.sequelize.query(
            `CREATE FUNCTION \`getAvgTime\`(\`idServerIN\` INT(11) UNSIGNED)
            RETURNS int(4) unsigned READS SQL DATA
            COMMENT 'Get avg time'
            RETURN (SELECT round(avg(\`monitoring__times\`.\`totalTime\`),0) FROM \`monitoring__times\`  WHERE \`idServer\` = idServerIN)
            `
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query('DROP FUNCTION getAvgTime');
    },
};
