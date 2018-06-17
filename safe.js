'use strict';

const _ = require('./src/main/utils/SafeGet');

const LoggerFactory = require('./src/main/logging/LoggerFactory')
const getConfigFromEnv = require('./src/main/utils/GetConfigFromEnv');

const loggerFactory = new LoggerFactory(getConfigFromEnv());

module.exports = function getLogger(loggerName) {
  return loggerFactory.getLogger(loggerName)
}


