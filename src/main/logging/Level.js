'use strict';

module.exports = Object.freeze({
  OFF: { priority: -1, label: 'OFF' },
  FATAL: { priority: 0, label: 'FATAL' },
  ERROR: { priority: 1, label: 'ERROR' },
  WARN: { priority: 2, label: 'WARN' },
  INFO: { priority: 3, label: 'INFO' },
  DEBUG: { priority: 4, label: 'DEBUG' },
  TRACE: { priority: 5, label: 'TRACE' }
});