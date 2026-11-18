# Agent guide

Better than average helps curious people discover challenges, try new skills, and collect small wins in a skill passport.

## Develop and verify

- Plain HTML, CSS, and JavaScript modules; Node.js 20+. No package installation is needed.
- `npm run dev` serves <http://127.0.0.1:4173/better-than-average/>.
- Run `npm test` for behavior changes and `npm run build` after app changes. Preview the build with `node scripts/serve.mjs --dist`.
- Edit root source files; `dist/` is generated and `.artifacts/` holds local outputs. Keep asset URLs relative for the GitHub Pages subpath.
- For UI changes, check the rendered desktop/mobile experience, both themes, and reduced motion where affected. Report only checks actually performed.

## Load deeper context when relevant

- Product decisions: [PRODUCT.md](PRODUCT.md) is the product authority; [README.md](README.md) describes the current prototype and deployment workflow.
- Challenge rules and results: [model.js](model.js) and [model tests](tests/model.test.js).
- Catalogue or comparison changes: [data.js](data.js) and [source register](docs/benchmarks.md). Keep targets, protocols, cohorts, and source dates consistent.
- Main interface: [index.html](index.html), [app.js](app.js), and [styles.css](styles.css). Passport behavior and presentation: [passport.js](passport.js) and [passport.css](passport.css).
- UI design: follow the [Impeccable skill](.agents/skills/impeccable/SKILL.md) and the **code-first** default in [.impeccable/config.json](.impeccable/config.json). Preserve the existing visual identity unless a redesign is requested.
