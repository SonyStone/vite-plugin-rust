import init, { greet } from './rust-hello-world/pkg';

export function otherFile() {
  init().then(() => {
    greet();
  });
}
