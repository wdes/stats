'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Api__TokenAliases', {
            token: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING,
                comment: 'Token',
            },
            alias: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING,
                comment: 'Alias du groupe de scopes',
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                comment: 'Creation date',
            },
            updatedAt: {
                allowNull: true,
                type: Sequelize.DATE,
                comment: 'Update date',
            },
        });
    },
    down: (queryInterface) => {
        return queryInterface.dropTable('Api__TokenAliases');
    },
};
