'use strict';
module.exports = (sequelize, DataTypes) => {
    const Api__Scopes = sequelize.define(
        'Api__Scopes',
        {
            name: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            description: DataTypes.STRING,
        },
        {
            timestamps: false,
            freezeTableName: true,
        }
    );
    Api__Scopes.associate = function(models) {
        // associations can be defined here
    };
    return Api__Scopes;
};
