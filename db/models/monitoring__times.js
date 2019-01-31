'use strict';
module.exports = (sequelize, DataTypes) => {
    const monitoring__times = sequelize.define(
        'monitoring__times',
        {
            idServer: {
                primaryKey: false,
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            time: {
                primaryKey: false,
                type: 'TIMESTAMP',
                allowNull: false,
            },
            totalTime: {
                primaryKey: false,
                type: DataTypes.FLOAT,
                allowNull: false,
            },
        },
        {
            timestamps: false,
            freezeTableName: true,
        }
    );
    monitoring__times.associate = function(models) {
        monitoring__times.belongsTo(models.monitoring__servers, {
            foreignKey: 'idServer',
            targetKey: 'id',
            as: 'server',
        });
    };
    monitoring__times.removeAttribute('id');
    return monitoring__times;
};
