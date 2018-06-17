'use strict';

// classes/constants
const os = require('os');
const stream = require('stream');
const Level = require('./Level');
const Logger = require('./Logger');
const Stream = require('./Stream');
const Colors = require('./Colors');
const terminate = require('../utils/Terminate');
const doNothing = require('../utils/DoNothing');

// functions
const _ = require('../utils/SafeGet');

// local constants
const DEFAULT_LAYOUT = ':timestamp :c[bold]:c[level][:level]:c[reset] :c[bold]:c[white]:logger:c[reset]:c[dim]@:hostname (:pid):c[reset] - :message:c[level]:error';

module.exports = class LoggerFactory {

  constructor(config) {
    const isColorEnabled = toBoolean(() => config.colors.enabled, true);
    const stream = getStreams(config);
    this.config = {
      layout: initializeLayout(config, isColorEnabled, stream),
      level: Level[_(() => config.level, 'INFO').toUpperCase()] || Level.INFO,
      colors: {
        enabled: isColorEnabled,
        FATAL: toLevelColor(config, 'fatal', 'magenta', isColorEnabled, stream, true),
        ERROR: toLevelColor(config, 'error', 'red', isColorEnabled, stream, true),
        WARN: toLevelColor(config, 'warn', 'yellow', isColorEnabled, stream),
        INFO: toLevelColor(config, 'info', 'white', isColorEnabled, stream),
        DEBUG: toLevelColor(config, 'debug', 'green', isColorEnabled, stream),
        TRACE: toLevelColor(config, 'trace', 'cyan', isColorEnabled, stream)
      },
      errorIndenter: _(() => config.errorIndenter, '    | '),
      stream: stream,
      terminateOnFail: toBoolean(() => config.terminateOnFail, true) ? terminate : doNothing
    }
  }

  getLogger(loggerName = '') {
    return new Logger(loggerName, this.config);
  }

}

function toBoolean(func, defaultValue) {
  return _(func, `${defaultValue}`).toLowerCase() === 'true'
}

function getStreams(config) {
  const streamConfig = _(() => config.stream);
  if (!!streamConfig) {
    if (streamConfig instanceof stream.Writable) {
      return {
        out: streamConfig,
        err: streamConfig
      }
    } else if (typeof streamConfig === 'object') {
      return {
        out: streamConfig.out instanceof stream.Writable ? streamConfig.out : process.stdout,
        err: streamConfig.err instanceof stream.Writable ? streamConfig.err : process.stderr
      }
    } else if (typeof streamConfig === 'string') {
      return Stream[streamConfig] || Stream.DEFAULT;
    }
  }
  return Stream.DEFAULT;
}

function initializeLayout(config, isColorEnabled, stream) {
  let layout = ':c[reset]'.concat(_(() => config.layout, DEFAULT_LAYOUT))
    .replace(/\:hostname/g, os.hostname())
    .replace(/\:pid/g, process.pid)
    .replace(/\:\[n\]/g, '\n');
  if (layout.indexOf(':error') > -1) {
    layout = `${layout.replace(/\:error/g, '')}:error`;
  }
  layout = `${layout}:c[reset]\n`;
  return isColorEnabled && !!stream.out.isTTY && !!stream.err.isTTY ?
    doColor(layout) : noColor(layout);
}

function toLevelColor(config, levelLabel, defaultColor, isColorEnabled, stream, isError = false) {
  if (!isColorEnabled || (isError && !(!!stream.err.isTTY)) || (!isError && !(!!stream.out.isTTY))) {
    return '';
  }
  return doColor(`:c[${_(() => config.colors[levelLabel], defaultColor).toLowerCase()}]`);
}

function noColor(string) {
  return string
    .replace(/(?!\:c\[level\]|\:c\[reset\])\:c\[\w+\.?\w+\]/g, '');
}

function doColor(string) {
  return string
    .replace(/\:c\[reset\]/g, Colors.RESET)
    .replace(/\:c\[bold\]/g, Colors.BOLD)
    .replace(/\:c\[dim\]/g, Colors.DIM)
    .replace(/\:c\[underscore\]/g, Colors.UNDERSCORE)
    .replace(/\:c\[blink\]/g, Colors.BLINK)
    .replace(/\:c\[reverse\]/g, Colors.REVERSE)
    .replace(/\:c\[hidden\]/g, Colors.HIDDEN)
    .replace(/\:c\[black\]/g, Colors.FG.BLACK)
    .replace(/\:c\[red\]/g, Colors.FG.RED)
    .replace(/\:c\[green\]/g, Colors.FG.GREEN)
    .replace(/\:c\[yellow\]/g, Colors.FG.YELLOW)
    .replace(/\:c\[blue\]/g, Colors.FG.BLUE)
    .replace(/\:c\[magenta\]/g, Colors.FG.MAGENTA)
    .replace(/\:c\[cyan\]/g, Colors.FG.CYAN)
    .replace(/\:c\[white\]/g, Colors.FG.WHITE)
    .replace(/\:c\[bg.black\]/g, Colors.BG.BLACK)
    .replace(/\:c\[bg.red\]/g, Colors.BG.RED)
    .replace(/\:c\[bg.green\]/g, Colors.BG.GREEN)
    .replace(/\:c\[bg.yellow\]/g, Colors.BG.YELLOW)
    .replace(/\:c\[bg.blue\]/g, Colors.BG.BLUE)
    .replace(/\:c\[bg.magenta\]/g, Colors.BG.MAGENTA)
    .replace(/\:c\[bg.cyan\]/g, Colors.BG.CYAN)
    .replace(/\:c\[bg.white\]/g, Colors.BG.WHITE);
}
