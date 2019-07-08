'use strict';

import { Model, DataTypes, BuildOptions } from 'sequelize';
import Sequelize from '@static/sequelize';

export class ApiScopesModel extends Model {
    public name!: string;
    public description!: string;

    public static associations: {};
}

export type ApiScopesStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): ApiScopesModel;
};

const ApiScopes = <ApiScopesStatic>Sequelize.sequelize.define(
    'Api__Scopes',
    {
        name: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        description: DataTypes.STRING,
    },
    {
        tableName: 'Api__Scopes',
        timestamps: false,
        freezeTableName: true,
    }
);
ApiScopes.removeAttribute('id');

export default ApiScopes;
