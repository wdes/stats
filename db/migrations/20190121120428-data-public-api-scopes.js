'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const Api__Scopes = queryInterface.sequelize.import(__dirname + '/../models/api__scopes');
        return Api__Scopes.create({
            name: 'api.index',
            description: 'Api description and status',
        });
    },

    down: (queryInterface, Sequelize) => {
        const Api__Scopes = queryInterface.sequelize.import(__dirname + '/../models/api__scopes');
        return Api__Scopes.findByPk('api.index').then(model => {
            model.destroy();
        });
    },
};
