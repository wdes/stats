'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query(
            `CREATE PROCEDURE \`recordStat\`(IN \`idServer\` INT(11) UNSIGNED, IN \`tstamp\` TIMESTAMP, IN \`totalTime\` FLOAT UNSIGNED, IN \`statusCodeIN\` SMALLINT(6) UNSIGNED)
                MODIFIES SQL DATA
                COMMENT 'Record a stat'
            BEGIN
                SELECT getLastStatusCode(idServer) INTO @lastStatusCode;
                START TRANSACTION;
                    INSERT INTO \`monitoring__status-codes\`(\`idServer\`, \`time\`, \`statusCode\`) VALUES (idServer,tstamp,statusCodeIN);

                    INSERT INTO \`monitoring__times\`(\`idServer\`, \`time\`, \`totalTime\`) VALUES (idServer,tstamp,totalTime);
                COMMIT;

                SELECT serverHasChangedStatus(idServer) INTO @changed;

                IF (@changed = TRUE) THEN
                    SELECT CONCAT(
                        '{"name": "STATUS_CHANGED", "prevCode": "',
                        IFNULL(@lastStatusCode, 'null'),

                        '", "actualCode": "',statusCodeIN,'", "ts": ',
                        UNIX_TIMESTAMP(CONVERT_TZ(tstamp, '+00:00', @@global.time_zone))
                        ,'}') INTO @msg;
                    SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO=30001, MESSAGE_TEXT= @msg;
                END IF;
            END
            `
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query('DROP PROCEDURE recordStat');
    },
};
