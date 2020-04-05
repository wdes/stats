'use strict';

import * as config from '@config/db';
import logger from '@util/logger';
import { Sequelize } from 'sequelize';

const env = process.env.NODE_ENV || '';
const dbConfig = config[env];
if (env !== 'production') {
    dbConfig.logging = (msg) => logger.debug(msg);
    dbConfig.logging = false;
} else {
    dbConfig.logging = false;
}

const sequelizeInstance = new Sequelize(dbConfig);

const sq: {
    sequelize: Sequelize;
    Sequelize: any;
} = {
    sequelize: sequelizeInstance,
    Sequelize: Sequelize,
};

export default sq;
