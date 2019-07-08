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
 * @param {string[]} chunks The chunks to send
 */

/**
 *
 * @param {string[]} tasks The tasks
 * @param {number} maxLength The max length
 * @param {emptyQueueCallback} emptyQueue
 */
const sendStack = (tasks: string[], maxLength: number, emptyQueue: (chunks: string[]) => void): void => {
    emptyQueue(chunkSubstr(tasks.join('\n--\n'), maxLength));
};

export default () => {
    let task: cron.ScheduledTask;

    /**
     * @var {string[]} tasks The tasks
     */
    let tasks: string[] = [];

    let maxLength = 0;

    return {
        chunkSubstr: chunkSubstr,
        addToStack: (message: string) => tasks.push(message),
        init: (maxiLength: number, cbTickSuccess: () => void, cbEmptyQueue: (messages: string[]) => void): void => {
            maxLength = maxiLength;
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
        getMaxLength: (): number => maxLength,
        getTasksCount: (): number => tasks.length,
        getTasks: () => tasks,
    };
};
