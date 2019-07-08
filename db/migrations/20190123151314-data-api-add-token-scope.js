'use strict';

const ApiTokenScopes = require('@models/apiTokenScopes');

module.exports = {
    up: (queryInterface, Sequelize) => {
        return ApiTokenScopes.default.create({
            name: 'server.laststatuscode',
            groupName: 'public',
        });
    },

    down: (queryInterface, Sequelize) => {
        return ApiTokenScopes.default
            .findOne({
                where: {
                    name: 'server.laststatuscode',
                    groupName: 'public',
                },
            })
            .then(model => {
                model.destroy();
            });
    },
};
