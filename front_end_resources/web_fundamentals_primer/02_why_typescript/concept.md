# 02 - Why TypeScript

## Picking the typing thread back up

`language_primer/00_why_three_languages` drew a line between **static typing** (Java, C++ — every variable's type is fixed and checked before the program runs) and **dynamic typing** (Python — a variable's type is only checked while the program runs, and can change). Plain JavaScript is dynamically typed, the same way Python is: `let x = 5; x = "five";` is completely legal, and nothing complains until (or unless) something downstream tries to do arithmetic on `"five"` and gets a confusing result instead of a clean error.

**TypeScript is JavaScript with an optional, static type-checking layer bolted on top.** Every `.ts` file gets compiled ("transpiled," more precisely) down to plain `.js` before it ever runs — nothing about TypeScript's types exists at runtime. Open `scouting_app/dist/assets/*.js` after running `npm run build` and you won't find a single type annotation in it; they're all erased, having already done their job at build time. This is exactly the "compiled catches mistakes before you ever run the program" side of the static-typing tradeoff from `00_why_three_languages`, just applied to a language that was dynamically typed to begin with.

## What you're actually annotating

- **Primitives and object shapes**, via `interface`: `types.ts`'s `ScoutingEntry` says exactly what fields a valid entry has and what type each one is — not a comment describing it, a checked contract every function that touches a `ScoutingEntry` has to honor.
- **A closed set of allowed values**, via a union of string literals: `type Alliance = "red" | "blue"` in `types.ts` accepts exactly two values, not "any string." Compare this to Java's `enum` from `language_primer/02_oop_inheritance` — different syntax, same underlying idea: a fixed, named, exhaustive set of options instead of an open-ended type that happens to usually hold sensible values.
- **Which of several shapes you're holding**, via a discriminated union: `ValidationResult` in `types.ts` is either `{ valid: true; entry: ScoutingEntry }` or `{ valid: false }`, and `main.ts`'s `if (!result.valid) return;` lets TypeScript *narrow* which shape you have for the rest of the block, with no cast required.

## The DOM forces the null question on you

`document.getElementById(id)`'s real return type isn't `HTMLElement` — it's `HTMLElement | null`, because the browser genuinely might not find an element with that id. Plain JavaScript (`01_foundations/scouting-form/script.js`) let you write `document.getElementById("team-number").value` without ever proving that element exists; if a ternary ever meant it didn't, you'd find out at runtime, from a crash, mid-demo. TypeScript won't let you call `.value` on something typed `HTMLElement | null` until you've actually handled the `null` case — which is exactly why `validation.ts`'s `requireElement<T>()` exists: it does that check once, throws a clear error if it fails, and returns a type with no `null` in it, so every caller downstream just gets to use the value.

This is the same discipline `systems_primer/08_error_handling_fault_tolerance` argued for by hand ("confirm it's actually there and actually reasonable, instead of assuming it") — the difference is that here, the compiler enforces it. You can't forget to add the null check the way you could forget to add a `DriverStation.reportWarning` call; the code simply won't compile until you've dealt with it.

## Generics: a function shaped like "any type, still checked"

`api.ts`'s `fakeSubmitToServer<T>(entry: T): Promise<T>` doesn't hardcode `ScoutingEntry` anywhere in its own definition — `T` is a placeholder, filled in by whatever you actually pass at the call site. Call it with a `ScoutingEntry` and TypeScript infers `T = ScoutingEntry`, and the returned `Promise` is typed `Promise<ScoutingEntry>` automatically, with no cast anywhere. This is different from just writing `entry: any`: `any` also accepts anything, but it throws every guarantee away in the process — a generic keeps whatever specific type you handed it the entire way through. `exercises/exercise-2-any-hides-a-typo.md` shows exactly what `any` costs you that a generic (or any real type) wouldn't.

## The actual tradeoff

None of this is free. You're writing more syntax than the plain-JS version of this same form, you now need a build step (`tsc`, or Vite running it for you) between editing a file and seeing it run, and every third-party library you use ideally ships its own type definitions or you lose some of this benefit at that boundary. This is precisely `00_why_three_languages`'s static-vs-dynamic tradeoff again: more upfront structure, in exchange for catching a whole category of mistakes — wrong shape, forgotten null check, typo'd field name — before the code ever runs, instead of during a match-day demo.

## Putting it together

`scouting_app/` is now a real npm project — the plain files from `01_foundations/scouting-form/` have been ported into `src/types.ts`, `src/validation.ts`, `src/api.ts`, `src/render.ts`, and `src/main.ts`, each typed. Run it:

```text
$ cd scouting_app
$ npm install
$ npm run dev
```

Then open the printed `localhost` URL. Also worth running directly, without the dev server: `npx tsc --noEmit` type-checks the whole project and prints nothing if everything's valid — this is what your editor is doing continuously in the background as you type.

## Resources

- [TypeScript Handbook: The Basics](https://www.typescriptlang.org/docs/handbook/2/basic-types.html) - primitives, interfaces, and type inference, in full.
- [TypeScript Handbook: Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) - the mechanism behind `ValidationResult`'s discriminated union.
- [TypeScript Handbook: Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html) - a full treatment of what `fakeSubmitToServer<T>` only scratches the surface of.
- [TypeScript: Do's and Don'ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html#general-types) - includes a direct case against reaching for `any`.
