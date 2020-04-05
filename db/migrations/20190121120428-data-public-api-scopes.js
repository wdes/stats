'use strict';

const ApiScopes = require('@models/apiScopes');

module.exports = {
    up: (queryInterface, Sequelize) => {
        return ApiScopes.default.create({
            name: 'api.index',
            description: 'Api description and status',
        });
    },

    down: (queryInterface, Sequelize) => {
        return ApiScopes.default.findByPk('api.index').then((model) => {
            model.destroy();
        });
    },
};
