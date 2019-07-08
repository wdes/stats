'use strict';

import { Model, DataTypes, BuildOptions } from 'sequelize';
import Sequelize from '@static/sequelize';

export class MonitoringServerModel extends Model {
    public id!: number;
    public url!: string;
    public name!: string;
    public monitoringInterval!: string;
    public disabled!: boolean;

    public static associations: {};
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

export default MonitoringServer;
