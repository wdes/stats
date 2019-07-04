'use strict';

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV;
const config = require('@config/db')[env];

module.exports = logger => {
    if (env !== 'production') {
        config.logging = msg => logger.debug(msg);
        config.logging = false;
    } else {
        config.logging = false;
    }
    const sequelizeInstance = new Sequelize(config);

    const sequelizerc = require('@root/.sequelizerc');

    const models = {};

    require('glob')
        .sync(sequelizerc['models-path'] + '/**/*.js')
        .forEach(file => {
            //logger.info("Loaded : "+file);
            var model = sequelizeInstance['import'](file);
            models[model.name] = model;
        });

    Object.keys(models).forEach(modelName => {
        if (models[modelName].associate) {
            models[modelName].associate(models);
        }
    });
    return Object.assign(
        {
            sequelize: sequelizeInstance,
            Sequelize: Sequelize,
            QueryTypes: sequelizeInstance.QueryTypes,
        },
        models
    );
};
