'use strict';

const LoggerFactory = require('./src/main/logging/LoggerFactory')
const getConfigFromEnv = require('./src/main/utils/GetConfigFromEnv');

const loggerFactory = new LoggerFactory(getConfigFromEnv());

module.exports = global.LoggerFactory = loggerFactory;
