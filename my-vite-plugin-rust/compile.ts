import chalk from 'chalk';
import { stat } from 'fs/promises';
import { makeEmpty } from './makeEmpty';
import { spawnWasmPack } from './spawnWasmPack';
import { WasmPackOptions } from './wasm-pack-options.interface';

const error = (msg: string) => console.error(chalk.bold.red(msg));
let info = (msg: string) => console.log(chalk.bold.blue(msg));

export function compile(
  watching: boolean,
  options: WasmPackOptions
): Promise<void> {
  info(
    `ℹ️  Compiling your crate in ${
      options.isDebug ? 'development' : 'release'
    } mode...\n`
  );

  return stat(options.crateDirectory)
    .then((stats) => {
      if (!stats.isDirectory()) {
        throw new Error(`${options.crateDirectory} is not a directory`);
      }

      return options;
    })
    .then(() => spawnWasmPack(options))
    .then(() => {
      info('✅  Your crate has been correctly compiled\n');
    })
    .catch((e) => {
      if (watching) {
        // This is to trigger a recompilation so it displays the error message
        makeEmpty(options.outDir, options.outName);
      }
    });
}
