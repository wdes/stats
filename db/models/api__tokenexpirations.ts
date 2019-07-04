'use strict';
module.exports = (sequelize, DataTypes) => {
    const Api__TokenExpirations = sequelize.define(
        'Api__TokenExpirations',
        {
            token: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            expires: DataTypes.DATE,
        },
        {
            freezeTableName: true,
        }
    );
    Api__TokenExpirations.associate = function(models) {
        // associations can be defined here
    };
    return Api__TokenExpirations;
};
