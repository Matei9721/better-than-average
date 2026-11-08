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

- 24 starter challenges, category/search/type filters, and random discovery.
- Goals, optional target dates, repeated attempts, evidence links and notes, and a skill passport.
- A five-round reaction-time game with a result you can add to an attempt.
- Custom challenges and personal variations of the starter catalogue.
- Light and dark themes; system appearance is used initially and the header switch overrides it for the tab.
- Changes live in memory and reset on refresh. The reset button clears the playground immediately after confirmation.

## Honest comparisons

Most starter challenges use explicitly labelled personal targets. The typing challenge compares against the published mean in [Aalto and Cambridge's 2018 typing study](https://www.aalto.fi/en/news/the-traits-of-fast-typists-discovered-by-analysing-136-million-keystrokes), with the study population and method visible in its details. A self-reported result is not independent verification or a world percentile. Reaction time has a personal target because browsers, displays, and input devices affect results.

The two counts remain separate. Repeat successes count once per challenge; later attempts do not erase a dated achievement. Customizing a benchmark creates a personal challenge. Editing an existing custom challenge resets its attempts because its rules have changed.

Google Fonts supplies DM Sans and Space Grotesk, with system font fallbacks. No application data is sent to a server.

## GitHub Pages

The Pages workflow checks the challenge model, copies only the public site into `dist/`, and deploys that directory. All app asset URLs are relative, so the repository subpath works without a router or custom domain.

1. In repository **Settings → Pages**, choose **GitHub Actions** as the source.
2. Push the reviewed changes to `main`, or dispatch **Publish playground to GitHub Pages** manually.
3. Check the workflow and open its deployment URL.

Expected project URL after deployment: `https://matei9721.github.io/better-than-average/`.

Workflow setup follows [GitHub's Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
