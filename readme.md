All vite built-in plugins

- if build `vite:build-metadata` Prepares the rendered chunks to contain additional metadata during build.
- **not** build `vite:pre-alias` A plugin to avoid an aliased AND optimized dep from being aliased in src
- `aliasPlugin` 🍣 A Rollup plugin for defining aliases when bundling packages.
- ...prePlugins
- `vite:modulepreload-polyfill` whether to inject module preload polyfill. Note: does not apply to library mode.
- `vite:resolve` ???
- if build `vite:optimized-deps` ???
- `vite:css` Plugin applied before user plugins. Tests `css`, `less`, `sass`, `scss`, `styl`, `stylus`, `pcss`,`postcss`;
- if esbuild `vite:esbuild`
- `vite:json` Json Plugin
- `vite:wasm` Wasm Plugin
- `vite:worker` WebWorker Plugin
- `vite:worker-import-meta-url` Worker Import Meta Url Plugin
- `vite:asset` Asset Plugin. Tests `?raw` `?url`. Also supports loading plain strings with import text from './foo.txt?raw'
- ...normalPlugins
- `vite:define` Define Plugin
- `vite:css-post` CSS Post Plugin Plugin applied after user plugins
- if ssr `vite:ssr-require-hook` SSR Require Hook Plugin
- buildPlugins.pre:
  - `vite:watch-package-data` Watch Package Data Plugin
  - `vite:build-html` Compiles index.html into an entry js module
  - `commonjsPlugin` Convert CommonJS modules to ES6, so they can be included in a Rollup bundle
  - `vite:data-uri` (`@rollup/plugin-data-uri`) Build only, since importing from a data URI works natively.
    🍣 A Rollup plugin which imports modules from Data URIs.
  - (`@rollup/plugin-dynamic-import-vars`) 🍣 A rollup plugin to support variables in dynamic imports in Rollup.
  - `vite:asset-import-meta-url` Convert `new URL('./foo.png', import.meta.url)` to its resolved built URL
- ...postPlugins
- buildPlugins.post:
  - `vite:build-import-analysis` Build only. During serve this is performed as part of ./importAnalysis.
  - `vite:esbuild-transpile`
  - minify? `vite:terser`
  - manifest? `vite:manifest`
  - ssrManifest? `vite:ssr-manifest`
  - `vite:reporter` Build Reporter Plugin
  - `vite:load-fallback` A plugin to provide build load fallback for arbitrary request with queries.
- **not** build `vite:client-inject` some values used by the client needs to be dynamically injected by the server
- **not** build `vite:import-analysis` Server-only plugin that lexes, resolves, rewrites and analyzes url imports.

User Plugins are sorted by tags:

- `pre` → prePlugins
- `post` → postPlugins
- default → normalPlugins

---

The following hooks are called once on **server start**:

- options
- buildStart

The following hooks are called on each incoming module request:

- resolveId
- load
- transform

The following hooks are called when the server is closed:

- buildEnd
- closeBundle
