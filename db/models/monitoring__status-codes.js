'use strict';
module.exports = (sequelize, DataTypes) => {
    const monitoring__statusCodes = sequelize.define(
        'monitoring__status-codes',
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
            statusCode: {
                primaryKey: false,
                type: 'smallint',
                length: 6,
                allowNull: false,
            },
        },
        {
            timestamps: false,
            freezeTableName: true,
        }
    );
    monitoring__statusCodes.associate = function(models) {
        monitoring__statusCodes.belongsTo(models.monitoring__servers, {
            foreignKey: 'idServer',
            targetKey: 'id',
            as: 'server',
        });
    };
    monitoring__statusCodes.removeAttribute('id');
    return monitoring__statusCodes;
};
