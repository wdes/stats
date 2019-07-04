'use strict';

import { Model, DataTypes, Association, BuildOptions } from 'sequelize';
import Sequelize from '@static/sequelize';
import { MonitoringServerModel } from '@models/monitoring__servers';

export class MonitoringStatusCodeModel extends Model {
    public idServer!: number;
    public time!: Date;
    public statusCode!: number;

    public static associations: {
        server: Association<MonitoringStatusCodeModel, MonitoringServerModel>;
    };
}

export type MonitoringStatusCodeStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): MonitoringStatusCodeModel;
};

const MonitoringStatusCode = <MonitoringStatusCodeStatic>Sequelize.sequelize.define(
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
);
MonitoringStatusCode.belongsTo(MonitoringServer, {
    foreignKey: 'idServer',
    targetKey: 'id',
    as: 'server',
});
MonitoringStatusCode.removeAttribute('id');

export default MonitoringStatusCode;
