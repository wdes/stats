'use strict';
module.exports = (sequelize, DataTypes) => {
    const Api__TokenScopes = sequelize.define(
        'Api__TokenScopes',
        {
            name: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            groupName: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
        },
        {
            freezeTableName: true,
        }
    );
    Api__TokenScopes.associate = function(models) {
        // associations can be defined here
    };
    return Api__TokenScopes;
};
