'use strict';

import { Model, DataTypes, BuildOptions } from 'sequelize';
import Sequelize from '@static/sequelize';

export class ApiTokenScopesModel extends Model {
    public name!: string;
    public groupName!: string;

    public static associations: {};
}

export type ApiTokenScopesStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): ApiTokenScopesModel;
};

const ApiTokenScopes = <ApiTokenScopesStatic>Sequelize.sequelize.define(
    'Api__TokenScopes',
    {
        name: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        groupName: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
    },
    {
        tableName: 'Api__TokenScopes',
        timestamps: false,
        freezeTableName: true,
    }
);
ApiTokenScopes.removeAttribute('id');

export default ApiTokenScopes;
