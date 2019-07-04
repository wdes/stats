'use strict';

import { Model, DataTypes, Association, BuildOptions } from 'sequelize';
import Sequelize from '@static/sequelize';
import MonitoringTime, { MonitoringTimeModel } from '@models/monitoring__times';
import MonitoringStatusCode, { MonitoringStatusCodeModel } from '@models/monitoring__status-codes';

export class MonitoringServerModel extends Model {
    public id!: number;
    public url!: string;
    public name!: string;
    public monitoringInterval!: string;
    public disabled!: boolean;

    public static associations: {
        statusCodes: Association<MonitoringServerModel, MonitoringStatusCodeModel>;
        times: Association<MonitoringServerModel, MonitoringTimeModel>;
    };
}

export type MonitoringServerStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): MonitoringServerModel;
};

const MonitoringServer = <MonitoringServerStatic>Sequelize.sequelize.define(
    'MonitoringServer',
    {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            autoIncrement: true,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        monitoringInterval: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        disabled: {
            type: DataTypes.BOOLEAN,
        },
    },
    {
        timestamps: false,
        tableName: 'monitoring__servers',
        freezeTableName: true,
    }
);

/*MonitoringTime.hasMany(MonitoringStatusCodeModel, {
    foreignKey: 'id',
    sourceKey: 'idServer',
    as: 'statusCodes',
});
MonitoringTime.hasMany(MonitoringTimeModel, {
    foreignKey: 'id',
    sourceKey: 'idServer',
    as: 'times',
});*/

export default MonitoringServer;
