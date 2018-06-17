'use strict';

const _ = require('./SafeGet');

module.exports = function getConfigFromEnv() {
  return {
    layout: _(() => process.env.LOG_LAYOUT),
    level: _(() => process.env.LOG_LEVEL),
    colors: {
      enabled: _(() => process.env.LOG_COLORS_ENABLED),
      fatal: _(() => process.env.LOG_COLORS_FATAL),
      error: _(() => process.env.LOG_COLORS_ERROR),
      warn: _(() => process.env.LOG_COLORS_WARN),
      info: _(() => process.env.LOG_COLORS_INFO),
      debug: _(() => process.env.LOG_COLORS_DEBUG),
      trace: _(() => process.env.LOG_COLORS_TRACE)
    },
    errorIndenter: _(() => process.env.LOG_ERROR_INDENTER),
    stream: _(() => process.env.LOG_STREAM),
    terminateOnFail: _(() => process.env.LOG_TERMINATE_ON_FAIL)
  };
}