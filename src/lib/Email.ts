'use strict';

export default {
    emailChangeStatusCode: (name: string, prevCode: string, actualCode: string, timestamp: number): string => {
        const timeEvent = new Date(timestamp * 1000);
        return (
            '[WDES-STATS]\r\n' +
            'The status of server ' +
            name +
            ' changed, from: ' +
            prevCode +
            ', to: ' +
            actualCode +
            ', at: ' +
            timeEvent
        );
    },
};
