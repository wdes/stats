'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const Api__TokenAliases = queryInterface.sequelize.import(__dirname + '/../models/api__tokenaliases');
        return Api__TokenAliases.create({
            token: 'PuBlIcWGESsra7tbxYsDQ8PQOhMT0KeN',
            alias: 'public',
        });
    },

    down: (queryInterface, Sequelize) => {
        const Api__TokenAliases = queryInterface.sequelize.import(__dirname + '/../models/api__tokenaliases');
        return Api__TokenAliases.findOne({
            where: {
                token: 'PuBlIcWGESsra7tbxYsDQ8PQOhMT0KeN',
                alias: 'public',
            },
        }).then(model => {
            model.destroy();
        });
    },
};
