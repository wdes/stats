'use strict';

const ApiTokenScopes = require('@models/apiTokenScopes');

module.exports = {
    up: (queryInterface, Sequelize) => {
        return ApiTokenScopes.default.create({
            name: 'api.index',
            groupName: 'public',
        });
    },

    down: (queryInterface, Sequelize) => {
        return ApiTokenScopes.default
            .findOne({
                where: {
                    name: 'api.index',
                    groupName: 'public',
                },
            })
            .then(model => {
                model.destroy();
            });
    },
};
