'use strict';

import * as cron from 'node-cron';

/**
 * Chunk a string
 * @param {string} str The string
 * @param {number} size The size of a chunk
 * @returns {string[]} The array of chunks
 */
function chunkSubstr(str: string, size: number): string[] {
    const numChunks = Math.ceil(str.length / size);
    const chunks = new Array(numChunks);

    for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
        chunks[i] = str.substr(o, size);
    }

    return chunks;
}

/**
 * @callback emptyQueueCallback
 * @param {String[]} chunks The chunks to send
 */

/**
 *
 * @param {string[]} tasks The tasks
 * @param {number} maxLength The max length
 * @param {emptyQueueCallback} emptyQueue
 */
const sendStack = (tasks: string[], maxLength: number, emptyQueue): void => {
    emptyQueue(chunkSubstr(tasks.join('\n--\n'), maxLength));
};

export default () => {
    var task: cron.ScheduledTask;

    /**
     * @var {string[]} tasks The tasks
     */
    var tasks: string[] = [];

    var _maxLength = 0;

    return {
        chunkSubstr: chunkSubstr,
        addToStack: (message: string) => tasks.push(message),
        init: (maxLength, cbTickSuccess, cbEmptyQueue): void => {
            _maxLength = maxLength;
            tasks = [];
            task = cron.schedule('*/30 * * * * *', () => {
                sendStack(tasks, maxLength, cbEmptyQueue);
                tasks = [];
                cbTickSuccess();
            });
        },
        stop: (): void => {
            if (task) {
                task.stop();
            }
        },
        getCronTask: () => task,
        getMaxLength: (): number => _maxLength,
        getTasksCount: (): number => tasks.length,
        getTasks: () => tasks,
    };
};
