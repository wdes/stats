'use strict';

export enum AppMessageTypes {
    APP_STOP = 'appStop',
    SCHEDULE_SERVER = 'scheduleServer',
    UNSCHEDULE_SERVER = 'unScheduleServer',
}

export interface AppMessage {
    topic: AppMessageTypes;
    body?: any;
}
