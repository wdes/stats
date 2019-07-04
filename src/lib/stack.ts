'use strict';

const cron = require('node-cron');

/**
 * Chunk a string
 * @param {String} str The string
 * @param {Number} size The size of a chunk
 * @returns {String[]} The array of chunks
 */
function chunkSubstr(str, size) {
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
 * @param {String[]} tasks The tasks
 * @param {Number} maxLength The max length
 * @param {emptyQueueCallback} emptyQueue
 */
const sendStack = function(tasks, maxLength, emptyQueue) {
    emptyQueue(chunkSubstr(tasks.join('\n--\n'), maxLength));
};

module.exports = () => {
    var task = null;

    /**
     * @type {String[]} The tasks
     */
    var tasks = [];

    var _maxLength = 0;

    return {
        chunkSubstr: chunkSubstr,
        addToStack: message => tasks.push(message),
        init: (maxLength, cbTickSuccess, cbEmptyQueue) => {
            _maxLength = maxLength;
            tasks = [];
            task = cron.schedule('*/30 * * * * *', () => {
                sendStack(tasks, maxLength, cbEmptyQueue);
                tasks = [];
                cbTickSuccess();
            });
        },
        stop: () => {
            /* istanbul ignore next */
            if (task) {
                task.stop();
            }
        },
        getCronTask: () => task,
        getMaxLength: () => _maxLength,
        getTasksCount: () => tasks.length,
        getTasks: () => tasks,
    };
};
