'use strict';
module.exports = (sequelize, DataTypes) => {
    const queue = sequelize.define(
        'queue',
        {
            id: {
                primaryKey: false,
                type: DataTypes.STRING,
                length: 255,
                allowNull: false,
            },
            groupName: {
                type: DataTypes.STRING,
                length: 255,
                allowNull: false,
            },
            task: {
                type: DataTypes.TEXT,
                allowNull: false,
                comment: 'The task',
            },
            lock: {
                type: DataTypes.STRING,
                length: 255,
                allowNull: false,
            },
            priority: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            added: {
                primaryKey: true,
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
            },
        },
        {
            timestamps: false,
            freezeTableName: true,
        }
    );
    queue.associate = function(models) {
        // associations can be defined here
    };
    return queue;
};
