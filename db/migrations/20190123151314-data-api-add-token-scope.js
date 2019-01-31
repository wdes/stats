'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const Api__TokenScopes = queryInterface.sequelize.import(
            __dirname + '/../models/api__tokenscopes'
        );
        return Api__TokenScopes.create({
            name: 'server.laststatuscode',
            groupName: 'public',
        });
    },

    down: (queryInterface, Sequelize) => {
        const Api__TokenScopes = queryInterface.sequelize.import(
            __dirname + '/../models/api__tokenscopes'
        );
        return Api__TokenScopes.findOne({
            where: {
                name: 'server.laststatuscode',
                groupName: 'public',
            },
        }).then(model => {
            model.destroy();
        });
    },
};
