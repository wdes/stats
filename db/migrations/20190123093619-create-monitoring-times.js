'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface
            .createTable('monitoring__times', {
                idServer: {
                    primaryKey: false,
                    type: Sequelize.INTEGER.UNSIGNED,
                    allowNull: false,
                    comment: 'Server Id',
                    references: { model: 'monitoring__servers', key: 'id' },
                },
                time: {
                    primaryKey: false,
                    type: 'TIMESTAMP',
                    allowNull: false,
                    comment: 'Record timestamp',
                },
                totalTime: {
                    primaryKey: false,
                    type: Sequelize.FLOAT,
                    allowNull: false,
                    comment: 'Request total time',
                },
            })
            .then(function () {
                return queryInterface.sequelize.query(
                    "ALTER TABLE `monitoring__times` ADD UNIQUE `UNIQUE_idServer_time_totalTime`(`idServer`, `time`, `totalTime`) COMMENT 'UNIQUE'"
                );
            });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('monitoring__times');
    },
};
