'use strict';

const LoggerFactory = require('./logging/LoggerFactory');

module.exports = function getLoggerFactory(config) {
  return new LoggerFactory(config);
}