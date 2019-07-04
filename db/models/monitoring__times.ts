'use strict';

import { Model, DataTypes, Association, BuildOptions } from 'sequelize';
import Sequelize from '@static/sequelize';
import MonitoringServer from '@models/monitoring__servers';

export class MonitoringTimeModel extends Model {
    public idServer!: number;
    public time!: Date;
    public totalTime!: number;

    public static associations: {
        //server: Association<MonitoringTime, MonitoringServer>;
    };
}

export type MonitoringTimeStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): MonitoringTimeModel;
};

const MonitoringTime = <MonitoringTimeStatic>Sequelize.sequelize.define(
    'MonitoringTime',
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
        totalTime: {
            primaryKey: false,
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        tableName: 'monitoring__times',
        freezeTableName: true,
    }
);
MonitoringTime.hasOne(MonitoringServer, {
    sourceKey: 'idServer',
    foreignKey: 'id',
    as: 'server',
});
MonitoringTime.removeAttribute('id');

export default MonitoringTime;
