'use strict';

const LoggerFactory = require('./src/main/logging/LoggerFactory');

module.exports = function json(config, safe = false) {
  const loggerFactory = new LoggerFactory(config);
  if (!safe) {
    global.LoggerFactory = loggerFactory;
  }
  return loggerFactory;
}