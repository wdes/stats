'use strict';

const cron = require('node-cron');

var task = null;

var tasks = [];

var _maxLength = 0;

function chunkSubstr(str, size) {
    const numChunks = Math.ceil(str.length / size);
    const chunks = new Array(numChunks);

    for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
        chunks[i] = str.substr(o, size);
    }

    return chunks;
}


const emptyAndSendStack = function(emptyQueue) {
    emptyQueue(chunkSubstr(tasks.join("\n--\n"), _maxLength));
    tasks = [];
};

const init = function(maxLength, cbTickSuccess, cbEmptyQueue) {
    _maxLength = maxLength;
    tasks = [];
    task = cron.schedule('*/30 * * * * *', () => {
        emptyAndSendStack(cbEmptyQueue);
        cbTickSuccess();
    });
};

const addToStack = function(message) {
    tasks.push(message);
};

const stop = function() {
    /* istanbul ignore next */
    if (task) {
        task.stop();
    }
};

const getMaxLength = function() {
    return _maxLength;
};

const getTasksCount = function() {
    return tasks.length;
};

const getTasks = function() {
    return tasks.slice(0);
};

const getCronTask = function() {
    return task;
};

module.exports = {
    addToStack: addToStack,
    init: init,
    stop: stop,
    getCronTask: getCronTask,
    getMaxLength: getMaxLength,
    getTasksCount: getTasksCount,
    getTasks: getTasks,
};
