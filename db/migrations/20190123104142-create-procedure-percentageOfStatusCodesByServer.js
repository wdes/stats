'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query(
            `CREATE PROCEDURE \`percentageOfStatusCodesByServer\`(IN \`idServerIN\` INT(11) UNSIGNED)
            READS SQL DATA
            select statusCode, (count(*) / (select count(*) from \`monitoring__status-codes\` where \`idServer\` = idServerIN) ) * 100.0 as percentage
            from \`monitoring__status-codes\`
            where \`idServer\` = idServerIN
            group by statusCode`
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query(
            'DROP PROCEDURE percentageOfStatusCodesByServer'
        );
    },
};
