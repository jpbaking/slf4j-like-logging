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
const replaceAll = require('../utils/ReplaceAll');

// local constants
const DEFAULT_LAYOUT = ':timestamp :c[bold]:c[level][:level]:c[reset] :c[bold]:c[white]:logger:c[reset]:c[dim]@:hostname (:pid):c[reset]: :message:c[level]:error';

module.exports = class LoggerFactory {

  constructor(config) {
    const isColorEnabled = toBoolean(() => config.colors.enabled, 'true');
    const stream = getStreams(config);
    this.config = {
      layout: initializeLayout(config, isColorEnabled, stream),
      errorIndenter: _(() => config.errorIndenter, '    | '),
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
  const layout = ':c[reset]'.concat(_(() => config.layout, DEFAULT_LAYOUT), ':c[reset]')
    .replaceAll(':hostname', os.hostname())
    .replaceAll(':pid', process.pid);
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
    .replaceAll(':c[reset]', Colors.RESET)
    .replaceAll(':c[bold]', Colors.BOLD)
    .replaceAll(':c[dim]', Colors.DIM)
    .replaceAll(':c[underscore]', Colors.UNDERSCORE)
    .replaceAll(':c[blink]', Colors.BLINK)
    .replaceAll(':c[reverse]', Colors.REVERSE)
    .replaceAll(':c[hidden]', Colors.HIDDEN)
    .replaceAll(':c[black]', Colors.FG.BLACK)
    .replaceAll(':c[red]', Colors.FG.RED)
    .replaceAll(':c[green]', Colors.FG.GREEN)
    .replaceAll(':c[yellow]', Colors.FG.YELLOW)
    .replaceAll(':c[blue]', Colors.FG.BLUE)
    .replaceAll(':c[magenta]', Colors.FG.MAGENTA)
    .replaceAll(':c[cyan]', Colors.FG.CYAN)
    .replaceAll(':c[white]', Colors.FG.WHITE)
    .replaceAll(':c[bg.black]', Colors.BG.BLACK)
    .replaceAll(':c[bg.red]', Colors.BG.RED)
    .replaceAll(':c[bg.green]', Colors.BG.GREEN)
    .replaceAll(':c[bg.yellow]', Colors.BG.YELLOW)
    .replaceAll(':c[bg.blue]', Colors.BG.BLUE)
    .replaceAll(':c[bg.magenta]', Colors.BG.MAGENTA)
    .replaceAll(':c[bg.cyan]', Colors.BG.CYAN)
    .replaceAll(':c[bg.white]', Colors.BG.WHITE);
}
