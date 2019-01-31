'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        // SET GLOBAL log_bin_trust_function_creators = 1;
        return queryInterface.sequelize.query(
            `CREATE FUNCTION \`tokenExists\`(\`token\` VARCHAR(128) CHARSET utf8mb4)
            RETURNS tinyint(1) unsigned READS SQL DATA
            BEGIN
                RETURN ( SELECT Count(*) FROM Api__TokenAliases WHERE Api__TokenAliases.token = token ) > 0;
            END`
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query('DROP FUNCTION tokenExists');
    },
};
