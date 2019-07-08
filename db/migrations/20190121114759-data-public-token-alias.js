'use strict';

const ApiTokenAliases = require('@models/apiTokenAliases');

module.exports = {
    up: (queryInterface, Sequelize) => {
        return ApiTokenAliases.default.create({
            token: 'PuBlIcWGESsra7tbxYsDQ8PQOhMT0KeN',
            alias: 'public',
        });
    },

    down: (queryInterface, Sequelize) => {
        return ApiTokenAliases.default
            .findOne({
                where: {
                    token: 'PuBlIcWGESsra7tbxYsDQ8PQOhMT0KeN',
                    alias: 'public',
                },
            })
            .then(model => {
                model.destroy();
            });
    },
};
