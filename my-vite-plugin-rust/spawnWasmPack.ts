import { findWasmPack } from './findWasmPack';
import { runProcess } from './runProcess';
import { WasmPackOptions } from './wasm-pack-options.interface';

export function spawnWasmPack({
  outDir,
  outName,
  isDebug,
  crateDirectory,
  args,
  extraArgs,
}: WasmPackOptions) {
  const bin = findWasmPack();

  const allArgs = [
    ...args,
    'build',
    '--target',
    'web',
    '--out-dir',
    outDir,
    '--out-name',
    outName,
    ...(isDebug ? ['--dev'] : []),
    ...extraArgs,
  ];

  const options = {
    cwd: crateDirectory,
    stdio: 'inherit',
  };

  return runProcess(bin, allArgs, options);
}
