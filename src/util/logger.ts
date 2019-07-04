'use strict';

import * as cluster from 'cluster';
import * as log4js from 'log4js';
const logger = log4js.getLogger(cluster.isMaster ? 'server' : 'api [' + cluster.worker.id + ']');

export default logger;
