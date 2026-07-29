# 07 - Testing: Confidence Before It Touches a Real Match

## The same argument, aimed at a different kind of "match"

`systems_primer/06_testing_debugging` opened with the reason testing matters more on a competition robot than in most software: once a match starts, whatever your code does is what happens, so the goal is moving as many failures as possible from match problems to issues you catch beforehand. `00_intro` framed this topic as that exact same argument, aimed at components instead of a state machine. A scouting app has its own version of "once the match starts": the moment a strategist is actually reading the pick list during alliance selection is not the moment you want to discover `validateEntry` lets a blank team number through, or that the pick list's "Move up" button silently corrupts the list when clicked at the top row. Both of those are things this topic now checks automatically, every time, before either one ever gets the chance.

## Three tests, three altitudes

`src/validation.test.ts` sits at the bottom of the pyramid `general_programming_resources/07_testing_philosophy` describes: `validateEntry` is a pure function — draft in, `ValidationResult` out, no DOM, no React, no network — so testing it needs nothing but the function itself and some inputs. These run in well under a millisecond each, and there's no reason not to have many of them.

`src/components/ScoutingForm.test.tsx` is a step up: a real component tree (`ScouterIdentityProvider` wrapping `ScouterBadge` and `ScoutingForm` together, actually exercising the same context relationship `03_state_as_a_systems_problem` describes), rendered with [`@testing-library/react`](https://testing-library.com/docs/react-testing-library/intro/) and driven with [`@testing-library/user-event`](https://testing-library.com/docs/user-event/intro/):

```ts
await user.type(screen.getByLabelText("Team number"), "1515");
await user.click(screen.getByRole("button", { name: "Submit" }));
```

Every query here — `getByLabelText`, `getByRole` — finds elements the same way a screen reader or a sighted user actually would: by their accessible label, their role, their visible text. Nothing here reaches into `ScoutingForm`'s internal `useState` calls or checks a CSS class name. That's React Testing Library's actual guiding principle, not just a style preference: *the more your tests resemble the way your software is used, the more confidence they can give you.* A test that queries `.querySelector('.field input')` would still pass after `04_ui_ux_principles` changed a class name for purely visual reasons — but it would also keep passing if the label/input relationship silently broke, which is the one thing that actually matters to a real user.

`src/components/PickList.test.tsx` is the same altitude, aimed at something more specific: `06_visualization_and_output`'s exercise-2 had you delete a boundary guard by hand and watch the pick list corrupt itself. This file turns that exact scenario into an assertion that runs on every future change, instead of a bug that only gets rediscovered if someone happens to click the right button at the right moment:

```ts
it("never loses or duplicates a row, no matter how many times the top row's disabled 'up' button is clicked", async () => {
  ...
});
```

That's the actual argument for writing this particular test — not "more tests are inherently good," but "this specific thing broke once, in a specific way, and a red test should catch it immediately if it ever regresses."

## Mocking `saveEntry`, and why the mock still looks real

`ScoutingForm.test.tsx` replaces `api/scouting.ts` entirely:

```ts
vi.mock("../api/scouting.ts", () => ({
  saveEntry: vi.fn(),
}));
```

A real `saveEntry` either makes an actual Supabase network call or waits out `fakeSubmitToServer`'s 400–1000ms artificial delay — neither belongs in a test suite that should run in milliseconds and never depend on network access being available. But the mock still resolves to a real `StoredEntry` shape (`{ id, teamNumber, matchNumber, alliance, scouterName, notes }`), not an empty object or `undefined`. `general_programming_resources/07_testing_philosophy` calls this out directly: a mock is only as useful as how faithfully it represents the real thing it's standing in for. A mock that returned nothing would make the test pass without ever proving `ScoutingForm` actually does the right thing with whatever `saveEntry` gives it back.

## Two real bugs this topic's own tests ran into

Both of these are worth knowing about specifically, not just as trivia — they're exactly the kind of thing `general_programming_resources/06_debugging_methodology` and `08_reproducibility` are about, encountered here for real instead of staged as an example.

**First:** with no `afterEach(cleanup)` registered, a second test's queries started finding *two* of everything — two "Submit" buttons, two forms — because the first test's rendered DOM was still sitting in `document.body`. React Testing Library normally registers this cleanup automatically, but only when it detects Jest's or Vitest's *global* test APIs on `globalThis`. This project runs Vitest without `test.globals: true` (every test file here imports `describe`/`it`/`expect` explicitly, same as every other import in this app), so that auto-detection never fires — `setupTests.ts` has to register `afterEach(cleanup)` by hand instead.

**Second, and stranger:** `localStorage.clear()` — needed so `PickList.test.tsx` starts each test with a clean slate — threw `TypeError: localStorage.clear is not a function`. Node itself now ships a built-in `localStorage` global, and in this jsdom test environment `window` *is* `globalThis` — there's no separate "real" jsdom copy underneath to fall back on. Whichever implementation claims the global slot first wins, and Node's version has no backing file configured, so it's missing methods as basic as `.clear()`. That's a genuine "this test suite behaves differently depending on which Node version happens to be installed" bug — precisely the category `08_reproducibility` warns about — and the fix in `setupTests.ts` is to stop depending on either implementation and supply a small, deterministic `Storage` of our own instead.

## What this topic doesn't teach

This is mechanics: Vitest and React Testing Library, specifically, applied to this app. What makes a test worth having at all — the pyramid shape, what separates a good test from a brittle one, TDD as a tool instead of a religion, the judgment call of when *not* to test something — is `general_programming_resources/07_testing_philosophy`'s job, the same underlying thinking regardless of which framework ends up running the test. `systems_primer/06_testing_debugging` made the identical split for JUnit and WPILib simulation. If you haven't read that module yet, it's worth reading before treating any of this topic's specific test cases as a template to copy rather than an example of the philosophy applied.

## Putting it together

```text
$ cd scouting_app
$ npm test
```

All 12 tests across three files should pass. Then break something on purpose: comment out the `if (target < 0 || target >= order.length) return;` guard in `PickList.tsx`'s `move` function (the same line `06_visualization_and_output`'s exercise-2 had you delete by hand) and rerun `npm test` — confirm the boundary test actually turns red, then put the guard back and confirm it's green again. A test that can't fail isn't actually testing anything.

## Resources

- [Testing Library: Guiding Principles](https://testing-library.com/docs/guiding-principles/) - "the more your tests resemble the way your software is used, the more confidence they can give you," the idea behind every query used in this topic's component tests.
- [Vitest: Getting Started](https://vitest.dev/guide/) - the test runner itself, and why a Vite project reaches for it specifically (same config, same plugins, no second build pipeline to maintain).
- [testing-library/jest-dom](https://github.com/testing-library/jest-dom) - the matchers (`.toBeInTheDocument()`, `.toBeDisabled()`, etc.) `setupTests.ts` registers.
- [Node.js: Web Storage API](https://nodejs.org/api/webstorage.html) - Node's own built-in `localStorage`, and the exact global-collision behavior `setupTests.ts` works around.
