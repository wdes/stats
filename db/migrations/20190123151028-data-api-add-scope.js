'use strict';

const ApiScopes = require('@models/apiScopes');

module.exports = {
    up: (queryInterface, Sequelize) => {
        return ApiScopes.default.create({
            name: 'server.laststatuscode',
            description: 'Get last status code from a server',
        });
    },

    down: (queryInterface, Sequelize) => {
        return ApiScopes.default.findByPk('server.laststatuscode').then(model => {
            model.destroy();
        });
    },
};
