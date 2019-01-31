'use strict';

/**
 * Record a stat
 * @param {basicDB} basicDB The basicDB object
 * @param {integer} idServer The id of the server
 * @param {float} totalTime The total time in ms
 * @param {integer} statusCode The status code
 * @returns void
 */
const recordStat = function(basicDB, idServer, totalTime, statusCode, onError) {
    let d = new Date();
    d.setTimezone('UTC');
    basicDB.Procedure(
        'recordStat(?,?,?,?)',
        [idServer, d, totalTime, statusCode],
        () => {},
        err => onError(err)
    );
};

module.exports = {
    recordStat: recordStat,
};
