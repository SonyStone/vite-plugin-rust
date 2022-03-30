import chalk from 'chalk';
import { sync } from 'command-exists';
import { findWasmPack } from './findWasmPack';
import { runProcess } from './runProcess';

const commandExistsSync = sync;

const error = (msg: string) => console.error(chalk.bold.red(msg));
let info = (msg: string) => console.log(chalk.bold.blue(msg));

export async function checkWasmPack() {
  info('🧐  Checking for wasm-pack...\n');

  const bin = findWasmPack();
  if (bin) {
    info('✅  wasm-pack is installed at ' + bin + '. \n');
    return true;
  }

  info('ℹ️  Installing wasm-pack \n');

  if (commandExistsSync('npm')) {
    return runProcess('npm', ['install', '-g', 'wasm-pack'], {});
  } else if (commandExistsSync('yarn')) {
    return runProcess('yarn', ['global', 'add', 'wasm-pack'], {});
  } else {
    error(
      '⚠️ could not install wasm-pack, you must have yarn or npm installed'
    );
  }
  return false;
}
