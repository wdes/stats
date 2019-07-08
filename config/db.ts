require('dotenv').config({ path: __dirname + '/../.env' });
require('module-alias')(__dirname + '/../');

const pool = {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
};

const define = {
    underscored: false,
    freezeTableName: false,
    charset: 'utf8',
    dialectOptions: {
        collate: 'utf8_general_ci',
    },
    timestamps: true,
};

const config = {
    development: {
        username: process.env.DB_DEV_USER,
        password: process.env.DB_DEV_PASS,
        database: process.env.DB_DEV_DB,
        host: process.env.DB_DEV_HOST,
        seederStorage: 'json',
        dialect: 'mysql',
        migrationStorageTableName: 'migrations',
        pool: pool,
        define: define,
    },
    test: {
        username: process.env.DB_TEST_USER,
        password: process.env.DB_TEST_PASS,
        database: process.env.DB_TEST_DB,
        host: process.env.DB_TEST_HOST,
        seederStorage: 'json',
        dialect: 'mysql',
        migrationStorageTableName: 'migrations',
        pool: pool,
        define: define,
    },
    production: {
        username: process.env.DB_PROD_USER,
        password: process.env.DB_PROD_PASS,
        database: process.env.DB_PROD_DB,
        host: process.env.DB_PROD_HOST,
        seederStorage: 'json',
        dialect: 'mysql',
        migrationStorageTableName: 'migrations',
        pool: pool,
        define: define,
    },
};

export default config;
module.exports = config;
