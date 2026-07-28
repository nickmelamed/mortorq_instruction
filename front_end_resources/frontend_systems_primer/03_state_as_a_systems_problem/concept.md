# 03 - State as a Systems Problem

## The question this topic is actually asking

`systems_primer/03_state_machines` built its entire topic around one question, applied to a robot: **what is this thing doing right now, and what would have to happen for that to change?** It warned specifically about `boolean isIntaking, hasPiece, isScoring, isDone` — four flags that were all supposed to agree with each other, with nothing actually enforcing that. This topic asks the exact same question about a screen instead of a robot: **what states can this component be in, and what triggers moving between them?** Two concrete refactors below are both just that question, answered properly instead of with a pile of booleans.

## Refactor 1: `ScoutingForm`'s two flags that were secretly one state machine

Until this topic, `ScoutingForm` tracked its submit process with `const [saving, setSaving] = useState(false)` and `const [status, setStatus] = useState("")` — two separate variables that had to be kept in sync by hand, every time, forever. Nothing stopped `saving` from being `true` while `status` said something stale, or `false` while `status` still said `"Saving..."`, the exact same shape of bug `systems_primer/03_state_machines` described. The fix is the same one that topic reached for:

```ts
type SubmitStatus =
  | { phase: "idle" }
  | { phase: "saving" }
  | { phase: "saved" }
  | { phase: "error"; message: string };
```

One variable, one of four named states, always. `submitStatus.phase === "saving"` disables the button; the status text is read directly off whichever phase you're in. There's no code path left where the button is enabled *and* the status says "Saving...," because that would require holding two states in one variable — structurally not possible anymore, the same way `03_state_machines`' enum made "intaking and scoring at once" structurally impossible instead of just unlikely.

You've actually already been using this exact pattern without the formal name: `api/types.ts`'s `FetchStatus<T>` (`idle` / `loading` / `error` / `success`) in `TeamLookup` since `01_consuming_apis` is the identical idea, just not named "a state machine" until now.

## Refactor 2: `scouterName` becomes Context, and here's exactly why

`03_react_core` argued composition beats global state at shallow depth, and up through this topic, every prop in this app has stayed shallow enough that the argument held. `scouterName` is the first piece of data that genuinely doesn't fit that shape, for a concrete reason: it's needed by three components that aren't in a simple parent-to-child line —

- `ScouterBadge`, next to `Header`, where you actually set it once per session.
- `ScoutingForm`, to attach the current name to a new entry.
- `EntryCard`, nested two levels down (`App` → `EntryList` → `EntryCard`), to show "(you)" next to entries you personally submitted.

`EntryList` — the component directly between `App` and `EntryCard` — has no reason to know a scouter's name exists at all. Threading `scouterName` through its props just so `EntryCard` could read it would mean adding a prop to a component purely so it can hand it to its child, unused. **That's the actual test for reaching for Context: not "is this shared," but "does this value have to pass through a component that doesn't care about it."** `entries` and `onEntrySaved` never hit that test — every component that touches them either owns them or receives them directly from the one component that does. `scouterName` does hit it, so it's the one piece of state in this app that gets `context/ScouterIdentityContext.tsx`.

## What the Context actually looks like

```tsx
const ScouterIdentityContext = createContext<ScouterIdentity | null>(null);

export function ScouterIdentityProvider({ children }: { children: ReactNode }) {
  const [scouterName, setScouterName] = useState("");
  return (
    <ScouterIdentityContext.Provider value={{ scouterName, setScouterName }}>
      {children}
    </ScouterIdentityContext.Provider>
  );
}
```

Underneath, this is still just `useState` — Context doesn't replace state, it changes *where a component reaches to find it*. `useScouterIdentity()` wraps `useContext` and throws if it's called outside the provider, rather than quietly returning a default. That's a deliberate design choice, not an oversight: a component reading this hook with no provider above it has a real bug (it will never see updates from anywhere else in the app), and a thrown error at the exact call site tells you that immediately instead of a value silently sitting stale three components away.

## Putting it together

```text
$ cd scouting_app
$ npm run dev
```

Type your name into the "Scouting as" field next to the header, then open the form below it — the read-only line inside the form updates immediately, with no prop connecting the two. Submit a few entries, then look at `EntryList`: entries matching your current name show `(you)`. Change the name in the badge and watch which cards say `(you)` change instantly.

## Resources

- [React: Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context) - the official walkthrough, including its own version of the "does this actually need Context" test.
- [React: Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context) - what to reach for once a single `useState` inside a provider stops being enough — not needed yet in this app, but the natural next step.
