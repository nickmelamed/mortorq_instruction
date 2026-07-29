# 08 - Deployment: Off Your Laptop, Onto a URL Your Team Can Actually Use

## The last "works on my machine"

Every topic in this primer has run on `localhost:5173`, on your laptop, with your `.env.local`, your `localStorage`, your Node install. `general_programming_resources/08_reproducibility` names the exact failure mode this invites: code that secretly depends on something true about *your* machine right now, never written down anywhere. Deployment is where that stops being a someday problem — the moment this app has to run correctly on a machine that is definitely not yours, for a teammate who has never run `npm install` in their life, this topic's whole job is making sure "works on my machine" was never actually the bar.

## What "deploying" a Vite app actually means

`npm run build` already produces `scouting_app/dist/` — plain HTML, CSS, and JS, nothing that needs a server running your code. That's the entire deliverable: **there is no backend to deploy here.** Supabase is already a separately-hosted service (`02_data_beyond_the_spreadsheet`); this app itself is a static bundle a browser can run from anywhere it's hosted. [Vercel](https://vercel.com/) is a host built around exactly that shape — point it at a GitHub repo, and it runs your build command, serves whatever `dist/` contains, and gives it a real URL.

## Git-triggered deploys, and the one monorepo-specific gotcha

Connect this repo to a Vercel project and two things start happening automatically: every push to `main` produces a new **production deploy**, and every pull request produces its own throwaway **preview deploy** with a unique URL — a real, clickable link in the PR itself, not just a diff someone has to run locally to see. That's `git_resources/git_primer/05-resolving-conflicts.md`'s exercise 5 (opening a real pull request) cashing out into something visible: a teammate can review a PR's *actual running app*, not just the code.

The one thing zero-config deployment doesn't figure out on its own: this repository holds an entire curriculum, not one app. When you import this repo into Vercel, you have to explicitly set the project's **root directory** to `front_end_resources/scouting_app` — otherwise Vercel looks for a `package.json` at the repo root, finds none, and either builds the wrong thing or fails outright. This is the single most common way a first deploy from a monorepo goes wrong, and it's a one-time setting, not something `vercel.json` needs to encode.

## Environment variables: baked in, not read at runtime

This is the part of deployment with real teeth. `import.meta.env.VITE_SUPABASE_URL` doesn't get read off a server's environment when someone visits the deployed site — Vite string-replaces every `VITE_`-prefixed variable directly into the JavaScript bundle **at build time**. Two consequences follow directly from that:

1. **Your `.env.local` never ships anywhere** — it's gitignored, so Vercel's build never sees it. `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_TBA_AUTH_KEY` have to be entered directly into the Vercel project's own Environment Variables settings, once, so the build running on Vercel's machine has them the same way your local build does.
2. **A `VITE_`-prefixed variable is not a secret, by construction.** Once it's baked into the bundle, anyone who visits the deployed site can open dev tools, view the page source, and read it in plain text. This is exactly why `VITE_SUPABASE_ANON_KEY` is safe to expose — it's *designed* to be public, with Row Level Security (`02_data_beyond_the_spreadsheet`) doing the actual access control — and exactly why `scripts/summarize-team.ts`'s `ANTHROPIC_API_KEY` deliberately has no `VITE_` prefix at all. That module called this "the single most important lesson in this whole topic: client-side code cannot keep a secret." This is that lesson's payoff: rename `ANTHROPIC_API_KEY` to `VITE_ANTHROPIC_API_KEY` and deploy, and it is now sitting in plain text in a JS file anyone can download — no dev tools sleuthing even required, just view-source.

## CI: the "verify" half, deliberately separate from the "ship" half

"CI/CD" names two related but distinct jobs: **continuous integration** (automatically verify every change) and **continuous deployment** (automatically ship whatever passes). Vercel's GitHub integration is this app's entire CD story — it deploys on every push, full stop, whether or not anything else passed. `.github/workflows/scouting-app-ci.yml` is the CI half, and it's genuinely simple: it runs the exact commands `07_testing` and this project's `tsconfig.json` already established — `npx tsc --noEmit`, `npm test`, `npm run build` — on a clean GitHub-hosted machine, on every push and pull request:

```yaml
- run: npx tsc --noEmit
- run: npm test
- run: npm run build
```

Three separate steps, not one. That's the same argument `07_testing` made about a test failing "for exactly one reason" — a red typecheck step tells you something different at a glance than a red test step or a red build step, before you've opened a single log.

**These two are not wired together by default**, and that's worth being exact about: Vercel doesn't wait for this GitHub Actions workflow to pass before it deploys. A broken pull request still gets its own preview URL. Making CI actually gate anything real — blocking a merge to `main` until the workflow passes — is a GitHub *branch protection rule*, configured separately in this repo's Settings, not something this workflow file does on its own. That's left as a deliberate next step, not built here, so this topic doesn't quietly overstate what one YAML file actually does.

## Pinning the runtime, not just the packages

`.nvmrc` (`20`) is new in `scouting_app/` this topic, and it's `08_reproducibility`'s "pinning extends to the language runtime itself" point, no longer hypothetical: the CI workflow reads it directly (`node-version-file: .nvmrc`) so the exact Node version running your tests and build is written down once, in one file, instead of "whatever happens to be on this machine." Your own laptop's Node version doesn't have to match it exactly to develop locally — but CI and Vercel now agree with each other, every time, regardless of what's installed on any one contributor's machine.

## Putting it together

1. Commit and push this branch (or `main`) to GitHub.
2. At [vercel.com](https://vercel.com/), sign in with GitHub and import this repository.
3. In the import screen, set **Root Directory** to `front_end_resources/scouting_app`. Vercel should auto-detect the Vite framework preset from there.
4. Before the first deploy (or right after, then redeploy), go to Project Settings → Environment Variables and add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_TBA_AUTH_KEY` with your real values.
5. Deploy. Visit the resulting URL and confirm the app loads, connects to Supabase, and behaves exactly like your local dev server.
6. Open a small pull request (change anything trivial) and confirm two things show up on it: a Vercel preview deploy comment with its own URL, and a "scouting_app CI" check from the GitHub Actions workflow.

## Resources

- [Vercel: Root Directory](https://vercel.com/docs/deployments/configure-a-build#root-directory) - the monorepo-specific setting this topic calls out as the most common first-deploy mistake.
- [Vite: Env Variables and Modes](https://vite.dev/guide/env-and-mode) - the full mechanics behind `VITE_`-prefixed variables getting compiled into the bundle at build time.
- [GitHub Actions: Workflow syntax](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions) - the full reference for everything used in `scouting-app-ci.yml`.
- [GitHub: About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches) - how you'd actually make a CI check block a merge, the deliberate next step this topic doesn't build.
- [The Twelve-Factor App: Config](https://12factor.net/config) - the canonical writeup of "store config in the environment," the idea behind this entire topic's environment-variable section.
