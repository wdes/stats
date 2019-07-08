'use strict';

import { Model, DataTypes, BuildOptions } from 'sequelize';
import Sequelize from '@static/sequelize';

export class QueueModel extends Model {
    public id!: number;
    public groupName!: string;
    public task!: string;
    public lock!: string;
    public priority!: number;
    public added!: number;

    public static associations: {};
}

export type QueueStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): QueueModel;
};

const Queue = <QueueStatic>Sequelize.sequelize.define(
    'Queue',
    {
        id: {
            primaryKey: false,
            type: DataTypes.STRING,
            allowNull: false,
        },
        groupName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        task: {
            type: DataTypes.TEXT,
            allowNull: false,
            comment: 'The task',
        },
        lock: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        priority: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        added: {
            primaryKey: true,
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            autoIncrement: true,
        },
    },
    {
        tableName: 'queue',
        freezeTableName: true,
        timestamps: false,
    }
);

export default Queue;
