'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Api__Scopes', {
            name: {
                primaryKey: true,
                type: Sequelize.STRING,
                comment: 'Nom du scope',
            },
            description: {
                type: Sequelize.STRING,
                comment: 'Description du scope',
            },
        });
    },
    down: (queryInterface) => {
        return queryInterface.dropTable('Api__Scopes');
    },
};
