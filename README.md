# Better than average

There are so many people on this planet. So many things to do. How many are you better than average at?

A responsive, light/dark web playground for discovering challenges and collecting real-world skills. Built with HTML, CSS, and JavaScript modules. No runtime dependencies, account, backend, analytics, or persisted profile.

## Play locally

Requires Node.js 20 or later. No package installation is needed.

```sh
node scripts/serve.mjs
```

Open [the local playground](http://127.0.0.1:4173/better-than-average/).

```sh
node --test
node scripts/build.mjs
node scripts/serve.mjs --dist
```

## What works

- 35 starter challenges: 12 study-based comparisons, 2 rank-data targets, and 21 personal targets, with category/search/type filters and random discovery.
- Goals, optional target dates, repeated attempts, evidence links and notes, and a skill passport.
- A five-round reaction-time game with a result you can add to an attempt.
- Custom challenges and personal variations of the starter catalogue.
- Light and dark themes; system appearance is used initially and the header switch overrides it for the tab.
- Changes live in memory and reset on refresh. The reset button clears the playground immediately after confirmation.

## Honest comparisons

Study-based cards show the comparison group, reference and publication year, with the protocol in their details. Some goals round published means upward to give people a practical target. Gaming cards have a separate **Rank data** label and use dated observed distributions rather than academic studies. The source register and rounding decisions are in [docs/benchmarks.md](docs/benchmarks.md).

A self-reported result is not independent verification or a world percentile. Reference groups vary by age, sex and participation; they are visible on the cards. Reaction time and playing a whole song remain personal targets. Musical listening uses Mini-PROMS and does not claim to measure instrument performance.

Sourced wins and personal wins remain separate. Repeat successes count once per challenge; later attempts do not erase a dated achievement. Running accepts minutes:seconds, League rank uses named choices, and bounded test scores reject impossible values. Customizing a benchmark creates a personal challenge, preserving its time or rank input format. Editing an existing custom challenge resets its attempts because its rules have changed.

Google Fonts supplies DM Sans and Space Grotesk, with system font fallbacks. No application data is sent to a server.

## GitHub Pages

The Pages workflow checks the challenge model, copies only the public site into `dist/`, and deploys that directory. All app asset URLs are relative, so the repository subpath works without a router or custom domain.

1. In repository **Settings → Pages**, choose **GitHub Actions** as the source.
2. Push the reviewed changes to `main`, or dispatch **Publish playground to GitHub Pages** manually.
3. Check the workflow and open its deployment URL.

Expected project URL after deployment: `https://matei9721.github.io/better-than-average/`.

Workflow setup follows [GitHub's Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
