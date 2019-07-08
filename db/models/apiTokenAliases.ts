'use strict';

import { Model, DataTypes, BuildOptions } from 'sequelize';
import Sequelize from '@static/sequelize';

export class ApiTokenAliasesModel extends Model {
    public token!: string;
    public alias!: string;

    public static associations: {};
}

export type ApiTokenAliasesStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): ApiTokenAliasesModel;
};

const ApiTokenAliases = <ApiTokenAliasesStatic>Sequelize.sequelize.define(
    'Api__TokenAliases',
    {
        token: DataTypes.STRING,
        alias: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
    },
    {
        tableName: 'Api__TokenAliases',
        timestamps: true,
        freezeTableName: true,
    }
);
ApiTokenAliases.removeAttribute('id');

export default ApiTokenAliases;
