'use strict';

import { Model, DataTypes, BuildOptions } from 'sequelize';
import Sequelize from '@static/sequelize';

export class MonitoringTimeModel extends Model {
    public idServer!: number;
    public time!: Date;
    public totalTime!: number;

    public static associations: {};
}

export type MonitoringTimeStatic = typeof Model &
    (new (values?: object, options?: BuildOptions) => MonitoringTimeModel);

const MonitoringTime = Sequelize.sequelize.define(
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
) as MonitoringTimeStatic;

MonitoringTime.removeAttribute('id');

export default MonitoringTime;
