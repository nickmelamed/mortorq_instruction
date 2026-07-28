# 04 - Hooks and Lifecycle

## What a hook actually is

`03_react_core` used `useState` several times without really explaining it, on purpose — the point there was data flow, not hooks. Time to actually explain it: a **hook** is a function, always starting with `use`, that lets a component keep something across renders that a plain local variable can't. A normal variable inside a component function resets to its initial value every single time that function runs again (every render); `useState`'s whole job is to give you a value that *survives* across renders, plus a setter that both updates it and tells React "please run this component's function again, its output may have changed."

## The rule that makes hooks work: same order, every time

React doesn't track `useState` calls by name — it tracks them **by the order they're called in**, per component. The first `useState` call in `ScoutingForm` is always slot 0, the second is always slot 1, and so on, every single render. This is exactly why hooks come with a hard rule: **call them unconditionally, at the top level of the component, never inside an `if`, a loop, or a nested function.** Something like this breaks that guarantee:

```tsx
// Don't do this.
if (draft.teamNumber.length > 0) {
  const [touched, setTouched] = useState(false);
}
```

On a render where `teamNumber` is empty, that `useState` call never happens — slot 1 shifts down to become whatever the *next* hook call in the component is, and every hook after it is now reading and writing the wrong slot. React can (and does) detect this and throws, specifically because silently reading the wrong slot would be a far worse bug than an error. Every hook in `scouting_app` is called at the very top of its component function, unconditionally, for exactly this reason.

## `useEffect`: synchronizing with something outside React

Everything so far — components, props, state — is React managing its own tree. `useEffect` exists for the opposite case: **synchronizing a component with something React doesn't manage** — the browser's `document.title`, a `window` event listener, a timer, a subscription to something external. `App.tsx` has a small one:

```tsx
useEffect(() => {
  document.title = entries.length > 0
    ? `1515 Match Scouting (${entries.length})`
    : "1515 Match Scouting";
}, [entries.length]);
```

The function runs after React updates the DOM, and the array at the end — the **dependency array** — tells React when to run it again: only when something in that array has changed since the last render. `[entries.length]` means "run this again only when the entry count changes," not on every render for unrelated reasons (typing in the notes field, for instance, shouldn't re-run this).

## Cleanup: releasing what an effect acquired

`ScoutingForm.tsx` has a second effect that's a better example of why cleanup exists at all:

```tsx
useEffect(() => {
  function handleShortcut(event: KeyboardEvent) {
    if (event.key === "n" && document.activeElement?.tagName !== "INPUT") {
      event.preventDefault();
      teamNumberInputRef.current?.focus();
    }
  }
  window.addEventListener("keydown", handleShortcut);
  return () => window.removeEventListener("keydown", handleShortcut);
}, []);
```

That effect **acquires** something — a `keydown` listener on `window` — and its return value is a **cleanup function** that releases it. React calls that cleanup function right before the effect runs again, and once more when the component unmounts. Skip the cleanup here and every time this effect re-ran, you'd stack up a *second* listener without ever removing the first — every keypress would eventually fire the handler multiple times, and the listener would keep running forever even after the component using it is gone.

This is precisely the shape `systems_primer/03_state_machines` described for a WPILib `Command`: `initialize()` runs once at the start, `execute()` runs every tick, and — critically — `end()` runs once, and its entire job is releasing whatever `initialize()` acquired, so a cancelled or finished command doesn't leave something running that should have stopped. An effect with no dependencies (`[]`) plus a cleanup function is the exact same shape: acquire once when the component mounts, release once when it unmounts. The dependency array is what makes `useEffect` more general than a plain "mount/unmount" hook — it lets you re-run the acquire/release pair whenever specific values change, not just once.

## Stale closures: the bug the dependency array exists to prevent

`01_foundations/exercises/exercise-2-debug-the-delete-buttons.md` had you debug a function that captured a value (`entries.length - 1`) at the moment it was *defined*, then used that stale value at the moment it was *called*, long after the real value had changed. `useEffect` has the exact same hazard, with a name: a **stale closure**. An effect's function closes over whatever values were in scope when React last ran it — if the effect reads a value it *doesn't* list in its dependency array, it'll keep using whatever that value was the last time the effect actually ran, not its current value. `exercises/exercise-2-the-stale-counter.md` has you reproduce this directly.

## Putting it together

```text
$ cd scouting_app
$ npm run dev
```

Submit a few entries and watch the browser tab's title update. Then, with focus somewhere other than an input, press `n` and confirm it jumps focus to the team number field — a real, if small, quality-of-life feature for a scout entering data quickly between matches, and a preview of the speed-under-pressure theme `frontend_systems_primer/04_ui_ux_principles` covers in full.

## Resources

- [React: Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects) - the official deep dive on when and why to reach for `useEffect`.
- [React: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) - equally important: a catalog of cases where reaching for `useEffect` is the wrong call, since it's easy to overuse once you know it exists.
- [React: Rules of Hooks](https://react.dev/warnings/invalid-hook-call-warning) - the call-order rule, stated formally.
- [Overreacted: A Complete Guide to useEffect](https://overreacted.io/a-complete-guide-to-useeffect/) - Dan Abramov's long-form treatment of stale closures and dependency arrays, worth the full read once the basics above feel solid.
