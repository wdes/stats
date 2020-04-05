'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('queue', {
            id: {
                primaryKey: false,
                type: Sequelize.STRING(255),
                allowNull: false,
                comment: 'Task Id',
            },
            groupName: {
                type: Sequelize.STRING(255),
                allowNull: false,
                comment: 'Group name',
            },
            task: {
                type: Sequelize.TEXT,
                allowNull: false,
                comment: 'The task',
            },
            lock: {
                type: Sequelize.STRING(255),
                allowNull: false,
                comment: 'Lock Id',
            },
            priority: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                comment: 'Priority',
            },
            added: {
                primaryKey: true,
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                comment: 'Lock',
            },
        });
    },
    down: (queryInterface) => {
        return queryInterface.dropTable('queue');
    },
};
