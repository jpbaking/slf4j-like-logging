'use strict';

module.exports = function _(func, defaultValue) {
  try {
    return func() || defaultValue;
  } catch (error) {
    return defaultValue;
  }
}