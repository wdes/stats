'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        // SET GLOBAL log_bin_trust_function_creators = 1;
        return queryInterface.sequelize.query(
            `CREATE FUNCTION \`serverHasChangedStatus\`(\`idServerIN\` INT(11) UNSIGNED)
            RETURNS tinyint(1) unsigned READS SQL DATA
            RETURN IFNULL(
            (
                (
                    -- last code
                    SELECT statusCode FROM \`monitoring__status-codes\`
                    WHERE \`idServer\` = idServerIN
                    ORDER BY \`time\` DESC
                    LIMIT 1 OFFSET 0
                ) <> (-- last code before the last code
                    SELECT statusCode FROM \`monitoring__status-codes\`
                    WHERE \`idServer\` = idServerIN
                    ORDER BY \`time\` DESC
                    LIMIT 1 OFFSET 1
                )
            ), FALSE)`
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query('DROP FUNCTION serverHasChangedStatus');
    },
};
