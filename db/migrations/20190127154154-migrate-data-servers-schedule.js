'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.changeColumn('monitoring__servers', 'monitoringInterval', {
            type: Sequelize.STRING(30),
            allowNull: false,
            comment: 'Monitoring interval',
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.changeColumn('monitoring__servers', 'monitoringInterval', {
            type: Sequelize.TIME,
            allowNull: false,
            comment: 'Monitoring interval',
        });
    },
};
