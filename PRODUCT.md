# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Curious people who want to try new things, explore different skills, and track small wins. The product should help them find something worth trying and build a record of what they have achieved.

## Product Purpose

Better than average makes skill discovery and personal progress playful: find a challenge, set a goal, try it, record the result, and collect an achievement in a skill passport.

Success means users discover things they want to attempt and can recognize their progress across different interests. No numerical product success metrics have been agreed.

## Positioning

The existing concept combines a broad challenge catalogue, published comparison targets, personal goals, and a stamp-based skill passport. It supports curiosity across activities rather than requiring users to specialize in one skill.

The name invites comparison, but the product must explain what each comparison actually measures. A result against a particular study group or historical rank distribution does not establish a worldwide percentile.

## Operating Context

The current experience runs in a browser on desktop and mobile. Its main workflows are:

- Discover challenges through categories, search, challenge-type filters, or random selection.
- Inspect a challenge's target, instructions, and any comparison group and sources.
- Save a goal, optionally choose a target date, and record repeated attempts with optional notes and evidence links.
- Review goals and completed challenges in a skill passport with dated achievement stamps.
- Create personal challenges or customize catalogue entries.

Categories currently span Move, Mind, Make, Everyday, Play, Digital, Music, and Outdoors. Some challenges happen outside the app or use external tests; results are self-reported.

## Capabilities and Constraints

### Current UI prototype

- Built with static HTML, CSS, and JavaScript modules, without a frontend framework or runtime package installation. Node.js 20 or later runs the local server, tests, and static build.
- Start locally with `node scripts/serve.mjs`; the app is served at `http://127.0.0.1:4173/better-than-average/`. The build command is `node scripts/build.mjs`. A GitHub Pages workflow publishes the static build.
- Goals, attempts, custom challenges, and achievements live in memory. Refreshing clears them. This is a temporary choice for refining the UI, not a long-term product requirement.
- Accounts, a backend, persistent profiles, and analytics are not implemented. Current application progress is not sent to a server; Google Fonts is an external font dependency.
- Study-based comparisons, rank-data comparisons, and personal targets have distinct labels. Reference-target wins and personal wins have separate totals.
- Repeat successes count once per challenge. A later unsuccessful attempt does not erase an earned achievement.
- Customizing a sourced challenge creates a personal target without attributing its changed rules to the original source. Editing an existing custom challenge clears its attempts because its rules changed.
- The browser reaction game is a five-round personal target. It does not claim a research-backed population comparison.
- The passport includes example stamps that are explicitly labelled and do not alter progress. The interface supports light/dark appearance and reduced-motion preferences.

### Confirmed long-term direction

Introduce accounts, stored progress, and ongoing tracking of goals, attempts, and achievements. Future product work must not treat refresh resets or session-only use as permanent requirements.

The account provider, backend and storage architecture, synchronization behavior, privacy and analytics policy, and release plan are undecided. This initialization records the direction; it does not implement those capabilities.

## Brand Commitments

The existing product name is **Better than average**. Its established copy includes “A little better. At a lot of things.” and a skill-passport vocabulary of goals, attempts, personal wins, and stamps.

The current voice encourages curiosity and small victories. Preserve factual, qualified comparison claims when developing that voice.

Existing brand assets are `assets/brand-lockup.svg`, `assets/brand-mark.svg`, and `assets/favicon.svg`.

## Evidence on Hand

- `data.js` contains the starter challenge catalogue, targets, protocols, comparison groups, and source metadata.
- `docs/benchmarks.md` records the comparison references, snapshot dates, limitations, and rounding decisions. These are existing documented references, not independently revalidated by this initialization.
- `model.js` and `tests/model.test.js` define and check current challenge, result, and achievement behavior.
- `index.html`, `app.js`, `passport.js`, and the associated styles implement the current interactive prototype.
- No user research, testimonials, adoption metrics, or validated business outcomes were supplied during initialization. Do not invent them.

## Product Principles

1. Make trying something new approachable and let users choose what interests them.
2. Make small wins visible while supporting repeated attempts and longer-term progress.
3. Keep personal goals distinct from sourced comparisons, and keep comparison groups and limitations available.
4. Treat evidence and results as self-reported unless a future verification mechanism is explicitly established.
5. Use the prototype to refine the experience while planning for accounts and durable progress.
