'use strict';

describe('No exceptions please.', function () {

  const LoggerFactory = require('../main/index')({
    layout: ':c[bold]:c[level][:level]:c[reset] :timestamp :c[bold]:c[white]:logger:c[reset]:c[dim]@:hostname (:pid):c[reset]: :message:c[level]:error',
    errorIndenter: '     | ',
    level: 'trace',
    colors: {
      fatal: 'cyan',
      error: 'green',
      warn: 'white',
      info: 'yellow',
      debug: 'red',
      trace: 'magenta'
    },
    stream: 'stderr',
    terminateOnFail: 'true'
  });

  const log = LoggerFactory.getLogger('test:dummy');

  it('log.fatal', function (done) {
    log.fatal('something logged', new Error('some error message'))
      .then(() => done());
  });

  it('log.error', function (done) {
    log.error('something logged', new Error('some error message'))
      .then(() => done());
  });

  it('log.warn', function (done) {
    log.warn('something logged', new Error('some error message'))
      .then(() => done());
  });

  it('log.info', function (done) {
    log.info('something logged', new Error('some error message'))
      .then(() => done());
  });

  it('log.debug', function (done) {
    log.debug('something logged', new Error('some error message'))
      .then(() => done());
  });

  it('log.trace', function (done) {
    log.trace('something logged', new Error('some error message'))
      .then(() => done());
  });

});