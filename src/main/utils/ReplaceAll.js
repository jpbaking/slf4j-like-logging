'use strict';

module.exports = replaceAll;

String.prototype.replaceAll = function (needle, replacement) {
  return replaceAll(this, needle, replacement);
}

function replaceAll(haystack, needle, replacement) {
  return haystack.replace(new RegExp(escapeRegExp(needle), 'g'), replacement);
}

function escapeRegExp(string) {
  return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}
