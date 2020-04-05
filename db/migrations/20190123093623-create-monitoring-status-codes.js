'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface
            .createTable('monitoring__status-codes', {
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
                statusCode: {
                    primaryKey: false,
                    type: 'smallint',
                    length: 6,
                    allowNull: false,
                    comment: 'Request status code',
                },
            })
            .then(function () {
                return queryInterface.sequelize.query(
                    "ALTER TABLE `monitoring__status-codes` ADD UNIQUE `UNIQUE_idServer_time_statusCode`(`idServer`, `time`, `statusCode`) COMMENT 'UNIQUE'"
                );
            });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('monitoring__status-codes');
    },
};
