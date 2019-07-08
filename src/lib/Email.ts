'use strict';

export default {
    emailChangeStatusCode: function(name: string, prevCode: string, actualCode: string, timestamp: number) {
        var timeEvent = new Date(timestamp * 1000);
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
