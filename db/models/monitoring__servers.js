'use strict';
module.exports = (sequelize, DataTypes) => {
    const monitoring__servers = sequelize.define(
        'monitoring__servers',
        {
            id: {
                primaryKey: true,
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
            },
            url: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            monitoringInterval: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            disabled: {
                type: DataTypes.BOOLEAN,
            },
        },
        {
            timestamps: false,
            freezeTableName: true,
        }
    );
    monitoring__servers.associate = function(models) {
        monitoring__servers.hasMany(models['monitoring__status-codes'], {
            foreignKey: 'idServer',
            sourceKey: 'id',
            as: 'statusCodes',
        });
        monitoring__servers.hasMany(models.monitoring__times, {
            foreignKey: 'idServer',
            sourceKey: 'id',
            as: 'times',
        });
    };
    return monitoring__servers;
};
