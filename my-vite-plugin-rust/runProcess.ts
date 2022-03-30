import { spawn } from 'child_process';

export function runProcess(
  bin: string,
  args: string[],
  options: any = {}
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const p = spawn(bin, args, options);

    p.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error('Rust compilation.'));
      }
    });

    p.on('error', reject);
  });
}
