import path, { basename } from 'path';
import { PluginOption } from 'vite';
import Watchpack from 'watchpack';
import { checkWasmPack } from './checkWasmPack';
import { compile } from './compile';
import { WasmPackOptions } from './wasm-pack-options.interface';

export interface VitePluginRustOptions {
  crates: string[];
}

export default function vitePluginRust(
  crates: string[] | string
): PluginOption {
  const cratePaths: string[] = Array.isArray(crates) ? crates : [crates];

  return {
    name: 'vite:rust',
    enforce: 'pre',
    buildStart() {
      return checkWasmPack()
        .then(() => Promise.all(cratePaths.map((path) => start(path))))
        .then(() => undefined);
    },
  };
}

function start(cratePath: string, options: Partial<WasmPackOptions> = {}) {
  const crateName = basename(cratePath);

  const root_folder = path.join(__dirname, '..');

  const wp: Watchpack = new Watchpack({});
  const crateDirectory: string = path.resolve(root_folder, crateName);
  const watchFiles: string[] = [path.resolve(crateName, 'Cargo.toml')];
  const watchDirectories: string[] = [path.resolve(crateDirectory, 'src')];

  const compileOptions = {
    outDir: 'pkg',
    outName: 'index',
    isDebug: true,
    args: ['--verbose'],
    extraArgs: [],
    ...options,
    crateDirectory,
  };

  if (true) {
    wp.watch(watchFiles, watchDirectories, Date.now() - 10000);

    wp.on('aggregated', () => {
      compile(true, compileOptions);
    });
  }

  return compile(false, compileOptions);
}
