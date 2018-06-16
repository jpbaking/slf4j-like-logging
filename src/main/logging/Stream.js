'use strict'

module.exports = Object.freeze({
  DEFAULT: { out: process.stdout, err: process.stdout },
  STDOUT: { out: process.stdout, err: process.stdout },
  STDERR: { out: process.stderr, err: process.stderr },
  STANDARD: { out: process.stdout, err: process.stderr }
});