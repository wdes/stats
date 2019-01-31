'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        // SET GLOBAL log_bin_trust_function_creators = 1;
        return queryInterface.sequelize.query(
            `CREATE FUNCTION \`hasPermission\`(\`token\` VARCHAR(128) CHARSET utf8mb4, \`scope\` VARCHAR(50)CHARSET utf8mb4)
            RETURNS tinyint(1) READS SQL DATA
            BEGIN
                RETURN ( SELECT COUNT(*) > 0 FROM Api__TokenAliases,Api__TokenScopes WHERE Api__TokenAliases.alias = Api__TokenScopes.groupName AND Api__TokenAliases.token = token AND Api__TokenScopes.name = scope);
            END`
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query('DROP FUNCTION hasPermission');
    },
};
