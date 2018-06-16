'use strict';

const replaceAll = require('../utils/ReplaceAll');
const Colors = require('./Colors');

const colorPattern = /\:c\[\w+(\.){0,1}\w+\]/g;

module.exports = function color(string, isError = false) {
  if (isError && !(!!process.stderr.isTTY)) {
    console.log('    is error and not tty')
    return string.replace(colorPattern, '');
  }
  if (!isError && !(!!process.stdout.isTTY)) {
    console.log('    is not error and not tty')
    return string.replace(colorPattern, '');
  }
  // if (() || (!isError && !(!!process.stdout.isTTY))) {
  //   return string.replace(colorPattern, '');
  // }
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