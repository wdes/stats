'use strict';

import { Model, DataTypes, BuildOptions } from 'sequelize';
import Sequelize from '@static/sequelize';

export class MonitoringStatusCodeModel extends Model {
    public idServer!: number;
    public time!: Date;
    public statusCode!: number;

    public static associations: {};
}

export type MonitoringStatusCodeStatic = typeof Model &
    (new (values?: object, options?: BuildOptions) => MonitoringStatusCodeModel);

const MonitoringStatusCode = Sequelize.sequelize.define(
    'MonitoringStatusCode',
    {
        idServer: {
            primaryKey: false,
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        time: {
            primaryKey: false,
            type: 'TIMESTAMP',
            allowNull: false,
        },
        statusCode: {
            primaryKey: false,
            type: 'smallint',
            allowNull: false,
        },
    },
    {
        timestamps: false,
        tableName: 'monitoring__status-codes',
        freezeTableName: true,
    }
) as MonitoringStatusCodeStatic;

MonitoringStatusCode.removeAttribute('id');

export default MonitoringStatusCode;
