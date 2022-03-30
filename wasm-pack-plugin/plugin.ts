import chalk from 'chalk';
import { sync } from 'command-exists';
import path from 'path';
import Watchpack from 'watchpack'; //  file watching
import { Compiler } from 'webpack';
import { checkWasmPack } from '../my-vite-plugin-rust/checkWasmPack';
import { compile } from '../my-vite-plugin-rust/compile';
import { makeEmpty } from '../my-vite-plugin-rust/makeEmpty';

const commandExistsSync = sync;

const error = (msg: string) => console.error(chalk.bold.red(msg));
let info = (msg: string) => console.log(chalk.bold.blue(msg));

export interface WasmPackPluginOptions {
  crateDirectory: string;
  args?: string;
  extraArgs?: string;
  forceWatch?: boolean;
  forceMode?: 'development' | 'production';
  outDir?: string;
  outName?: string;
  watchDirectories?: string[];
  /** Controls plugin output verbosity. Defaults to 'info'. */
  pluginLogLevel?: 'info' | 'error';
}

export class WasmPackPlugin {
  /**
   * In some cases Webpack will require the pkg entrypoint before it actually
   * exists. To mitigate that we are forcing a first compilation.
   *
   * See https://github.com/wasm-tool/wasm-pack-plugin/issues/15
   */
  _ranInitialCompilation = false;
  crateDirectory = this.options.crateDirectory;
  forceWatch = this.options.forceWatch;
  forceMode = this.options.forceMode;
  args = (this.options.args || '--verbose')
    .trim()
    .split(' ')
    .filter((x) => x);
  extraArgs = (this.options.extraArgs || '')
    .trim()
    .split(' ')
    .filter((x) => x);
  outDir = this.options.outDir || 'pkg';
  outName = this.options.outName || 'index';
  watchDirectories = (this.options.watchDirectories || []).concat(
    path.resolve(this.crateDirectory, 'src')
  );
  watchFiles = [path.resolve(this.crateDirectory, 'Cargo.toml')];

  wp = new Watchpack({});
  isDebug = true;
  error = null;

  constructor(private readonly options: WasmPackPluginOptions) {
    if (options.pluginLogLevel && options.pluginLogLevel !== 'info') {
      // The default value for pluginLogLevel is 'info'. If specified and it's
      // not 'info', don't log informational messages. If unspecified or 'info',
      // log as per usual.
      info = () => {};
    }
  }

  apply(compiler: Compiler) {
    this.isDebug = this.forceMode
      ? this.forceMode === 'development'
      : compiler.options.mode === 'development';

    // This fixes an error in Webpack where it cannot find
    // the `pkg/index.js` file if Rust compilation errors.
    makeEmpty(this.outDir, this.outName);

    // force first compilation
    compiler.hooks.beforeCompile.tapPromise('WasmPackPlugin', () => {
      if (this._ranInitialCompilation === true) {
        return Promise.resolve();
      }

      this._ranInitialCompilation = true;

      return checkWasmPack().then(() => {
        const shouldWatch =
          this.forceWatch ||
          (this.forceWatch === undefined && compiler.watchMode);

        if (shouldWatch) {
          this.wp.watch(
            this.watchFiles,
            this.watchDirectories,
            Date.now() - 10000
          );

          this.wp.on('aggregated', () => {
            compile(true, {
              outDir: this.outDir,
              outName: this.outName,
              isDebug: this.isDebug,
              crateDirectory: this.crateDirectory,
              args: this.args,
              extraArgs: this.extraArgs,
            });
          });
        }

        return compile(false, {
          outDir: this.outDir,
          outName: this.outName,
          isDebug: this.isDebug,
          crateDirectory: this.crateDirectory,
          args: this.args,
          extraArgs: this.extraArgs,
        });
      });
    });

    let first = true;

    compiler.hooks.thisCompilation.tap('WasmPackPlugin', (compilation) => {
      // Super hacky, needed to workaround a bug in Webpack which causes
      // thisCompilation to be triggered twice on the first compilation.
      if (first) {
        first = false;
      } else {
        // This is needed in order to gracefully handle errors in Webpack,
        // since Webpack has its own custom error system.
        if (this.error != null) {
          compilation.errors.push(this.error);
        }
      }
    });
  }
}
