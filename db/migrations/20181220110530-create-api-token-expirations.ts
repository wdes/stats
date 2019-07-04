'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Api__TokenExpirations', {
            token: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING,
                comment: 'Token',
            },
            expires: {
                type: Sequelize.DATE,
                comment: 'Expiration du token',
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
    down: queryInterface => {
        return queryInterface.dropTable('Api__TokenExpirations');
    },
};
