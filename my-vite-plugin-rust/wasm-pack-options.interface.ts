export interface WasmPackOptions {
  outDir: string;
  outName: string;
  isDebug: boolean;
  crateDirectory: string;
  args: string[];
  extraArgs: string[];
}
