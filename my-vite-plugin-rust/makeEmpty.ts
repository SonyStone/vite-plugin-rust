import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

export function makeEmpty(outDir: string, outName: string) {
  try {
    mkdirSync(outDir, { recursive: true });
  } catch (e) {
    if ((e as any).code !== 'EEXIST') {
      throw e;
    }
  }

  writeFileSync(join(outDir, outName + '.js'), '');
}
