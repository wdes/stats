'use strict';
module.exports = (sequelize, DataTypes) => {
    const Api__TokenAliases = sequelize.define(
        'Api__TokenAliases',
        {
            token: DataTypes.STRING,
            alias: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
        },
        {
            freezeTableName: true,
        }
    );
    Api__TokenAliases.associate = (_models: any) => {
        // associations can be defined here
    };
    return Api__TokenAliases;
};
