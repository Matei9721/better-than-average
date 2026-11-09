Anime.js WAAPI, version 4.5.0 (MIT, Julian Garnier).

Source: https://registry.npmjs.org/animejs/-/animejs-4.5.0.tgz

`anime-waapi.js` is the standalone WAAPI module, bundled and minified with
esbuild 0.28.2 from the published `dist/modules/waapi/index.js` entry point:

```sh
esbuild dist/modules/waapi/index.js --bundle --minify --format=esm --outfile=anime-waapi.js
```

The 10.2 KB module is loaded on demand when the passport opens. The full
JavaScript animation engine is not included. License: `anime-LICENSE.md`.
