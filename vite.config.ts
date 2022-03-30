import { resolve } from 'path';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import myVitePluginRust from './my-vite-plugin-rust';

export default defineConfig({
  plugins: [
    solidPlugin(),
    myVitePluginRust(['./rust-hello-world', './my-crate']),
  ],
  build: {
    rollupOptions: {
      input: [resolve(__dirname, 'index.html')],
    },
    target: 'esnext',
    polyfillDynamicImport: false,
  },
  publicDir: './public',
});
