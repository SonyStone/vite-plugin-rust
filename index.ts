import init, { greet } from './my-crate/pkg';

import init2, { greet as greet2, main_js } from './rust-hello-world/pkg';

export const main = () => {
  init().then(() => {
    console.log('init wasm-pack');
    greet('from vite!');
  });

  init2().then(() => {
    greet2();
    // main_js();
  });

  console.log(`❤ hello world javaScript ❤ `);
};

main();
