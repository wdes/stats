'use strict';

import { Model, DataTypes } from 'sequelize';
import Sequelize from '@static/sequelize';

export default class Queue extends Model {
    public id!: number;
    public groupName!: string;
    public task!: string;
    public lock!: string;
    public priority!: number;
    public added!: number;

    public static associations: {};
}

Queue.init(
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
        sequelize: Sequelize.sequelize,
    }
);
