'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Api__TokenScopes', {
            name: {
                type: Sequelize.STRING,
                primaryKey: true,
                allowNull: false,
                comment: 'Nom du scope',
                references: { model: 'Api__Scopes', key: 'name' },
            },
            groupName: {
                primaryKey: true,
                allowNull: false,
                type: Sequelize.STRING,
                comment: 'Nom du groupe de scopes',
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
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Api__TokenScopes');
    },
};
