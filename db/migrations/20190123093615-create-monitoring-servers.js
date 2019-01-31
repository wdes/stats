'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('monitoring__servers', {
            id: {
                primaryKey: true,
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                comment: 'Server Id',
            },
            url: {
                type: Sequelize.STRING,
                allowNull: false,
                comment: 'Url to monitor',
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                comment: 'Name of the monitor',
            },
            monitoringInterval: {
                type: Sequelize.TIME,
                allowNull: false,
                comment: 'Monitoring interval',
            },
            disabled: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                comment: 'Monitor is disabled',
            },
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('monitoring__servers');
    },
};
