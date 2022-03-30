import init, { greet } from './my-crate/pkg';
import { otherFile } from './other-file';

export const main = () => {
  init().then(() => {
    console.log('init wasm-pack');
    greet('from vite!');
  });

  otherFile();

  console.log(`❤ hello world javaScript ❤ `);
};

main();
