# Exercise 2: Find the "Secret" Sitting in Your Own Bundle

## Goal
Stop taking "a `VITE_`-prefixed variable is not a secret" on faith, and actually find one sitting in plain text in a file you built yourself.

## Steps
1. In `scouting_app/.env.local` (create the file if you don't already have one — it's gitignored, so this is safe to experiment in), add a fake value that's obviously not real:
   ```text
   VITE_FAKE_SECRET=super-secret-value-12345
   ```
2. Temporarily add one line to the very top of `src/main.tsx`:
   ```ts
   console.log(import.meta.env.VITE_FAKE_SECRET);
   ```
3. Build the app for real: `npm run build`.
4. Without opening the app in a browser at all, search the built output directly:
   ```text
   $ grep -r "super-secret-value-12345" dist/
   ```
5. Look at what actually matched. That's not a debug log statement anymore — it's a plain string sitting inside a `.js` file that would be served, as-is, to anyone who visits the deployed site.
6. Revert both changes — remove the `console.log` line from `main.tsx` and the `VITE_FAKE_SECRET` line from `.env.local` — and confirm `npm run build` still succeeds with no trace of it.

## Self-Check
- [ ] I ran the `grep` myself and saw the fake value inside `dist/`, not just read that it would be there
- [ ] I can point to the exact file inside `dist/` where it showed up
- [ ] I reverted both changes and confirmed the value is gone from a fresh build
- [ ] `npx tsc --noEmit` and `npm test` both still pass after reverting

## Reflection
`scripts/summarize-team.ts`'s real `ANTHROPIC_API_KEY` never showed up anywhere in `dist/` in this exercise, even though it's a genuinely sensitive value and `VITE_FAKE_SECRET` was a value you made up. What two separate facts about that script (not about the key itself) are actually responsible for that?
