'use strict';

export enum AppMessageTypes {
    APP_STOP = 'appStop',
    SCHEDULE_SERVER = 'scheduleServer',
    UNSCHEDULE_SERVER = 'unScheduleServer',
    TASKS_LIST = 'tasksList',
    ASK_TASKS_LIST = 'askForTasksList',
}

export interface AppMessage {
    topic: AppMessageTypes;
    body?: any;
}
