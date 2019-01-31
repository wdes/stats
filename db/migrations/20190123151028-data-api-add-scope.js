'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const Api__Scopes = queryInterface.sequelize.import(
            __dirname + '/../models/api__scopes'
        );
        return Api__Scopes.create({
            name: 'server.laststatuscode',
            description: 'Get last status code from a server',
        });
    },

    down: (queryInterface, Sequelize) => {
        const Api__Scopes = queryInterface.sequelize.import(
            __dirname + '/../models/api__scopes'
        );
        return Api__Scopes.findByPk('server.laststatuscode').then(model => {
            model.destroy();
        });
    },
};
