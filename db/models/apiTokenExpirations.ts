'use strict';

import { Model, DataTypes, BuildOptions } from 'sequelize';
import Sequelize from '@static/sequelize';

export class ApiTokenExpirationsModel extends Model {
    public token!: string;
    public expires!: Date;

    public static associations: {};
}

export type ApiTokenExpirationsStatic = typeof Model &
    (new (values?: object, options?: BuildOptions) => ApiTokenExpirationsModel);

const ApiTokenExpirations = Sequelize.sequelize.define(
    'Api__TokenExpirations',
    {
        token: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        expires: DataTypes.DATE,
    },
    {
        tableName: 'Api__TokenExpirations',
        timestamps: true,
        freezeTableName: true,
    }
) as ApiTokenExpirationsStatic;
ApiTokenExpirations.removeAttribute('id');

export default ApiTokenExpirations;
