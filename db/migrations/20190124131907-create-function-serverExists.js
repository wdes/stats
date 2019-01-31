'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        // SET GLOBAL log_bin_trust_function_creators = 1;
        return queryInterface.sequelize.query(
            `CREATE FUNCTION \`serverExists\`(\`idServerIN\` INT(11) UNSIGNED)
            RETURNS tinyint(1) NO SQL COMMENT 'Check if server exists'
            RETURN EXISTS(SELECT 1 FROM monitoring__servers WHERE monitoring__servers.id = idServerIN)
            `
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query('DROP FUNCTION serverExists');
    },
};
