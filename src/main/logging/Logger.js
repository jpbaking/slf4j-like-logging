'use strict';

// classes/constants
const util = require('util');
const Level = require('./Level');
const Colors = require('./Colors');
const doNothing = require('../utils/DoNothing');
const Promise = require('bluebird');

// functions
const replaceAll = require('../utils/ReplaceAll');

module.exports = class Logger {

  constructor(loggerName, config) {
    this.layout = config.layout.replaceAll(':logger', loggerName);
    this.config = config;
  }

  fatal(message, ...parameters) {
    return log(this, this.config.stream.err, Level.FATAL, message, ...parameters);
  }

  error(message, ...parameters) {
    return log(this, this.config.stream.err, Level.ERROR, message, ...parameters);
  }

  warn(message, ...parameters) {
    return log(this, this.config.stream.out, Level.WARN, message, ...parameters);
  }

  info(message, ...parameters) {
    return log(this, this.config.stream.out, Level.INFO, message, ...parameters);
  }

  debug(message, ...parameters) {
    return log(this, this.config.stream.out, Level.DEBUG, message, ...parameters);
  }

  trace(message, ...parameters) {
    return log(this, this.config.stream.out, Level.TRACE, message, ...parameters);
  }

}

function log(logger, stream, level, message, ...parameters) {
  if (logger.config.level.priority < level.priority) {
    return Promise.resolve();
  }
  return new Promise
    (function (resolve, reject) {
      const data = logger.layout
        .replaceAll(':timestamp', new Date().toISOString())
        .replaceAll(':level', level.label)
        .replaceAll(':error', extractError(logger.config.errorIndenter, parameters))
        .replaceAll(':c[level]', logger.config.colors[level.label])
        .replaceAll(':c[reset]', resolveResetValue(stream))
        .replaceAll(':message', util.format(message, ...parameters))
        .concat('\n');
      write(stream, data, resolve, reject);
    })
    .catch(function (error) {
      failOverWrite(logger.config.terminateOnFail,
        `An error has occurred while attempting to perform logging:\n${error.stack || error}\n`);
    });
}

function failOverWrite(terminator, data) {
  write(process.stderr, data, terminator, function () {
    write(process.stdout, data, terminator, terminator);
  });
}

function write(stream, data, resolve, reject) {
  try {
    if (!stream.write(data)) {
      stream.once('drain', resolve);
    } else {
      process.nextTick(resolve);
    }
  } catch (error) {
    reject(error);
  }
}

function resolveResetValue(stream) {
  return stream.isTTY ? Colors.RESET : '';
}

function extractError(indenter, parameters) {
  if (!!parameters && parameters.length > 0 && parameters[parameters.length - 1] instanceof Error) {
    const error = parameters.pop();
    return '\n'.concat(indenter, (error.stack || error).replace(/\n/g, '\n'.concat(indenter)));
  }
  return '';
}
