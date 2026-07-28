# 03 - React Core: Components, Props, and Data Flow

## What just happened to `scouting_app/`

Go look at `scouting_app/src/` before reading further. `main.ts` is gone, replaced by `main.tsx` and `App.tsx`. `render.ts` is gone entirely. `validation.ts` no longer touches the DOM at all. There's a new `components/` folder. This is the same form, migrated on purpose — not a fresh app — and the rest of this document is about *why* each of those changes happened, not just that they did.

## A component is a function that returns markup

`components/Header.tsx` is the smallest possible example:

```tsx
export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
}
```

That's it — a **component** is just a function, and the odd-looking HTML-in-a-function syntax is **JSX**, which is not a template language: `<header>` there doesn't run through some templating engine, it gets transpiled (by Vite's `@vitejs/plugin-react`, at build time) into a plain function call — roughly `React.createElement("header", null, ...)`. `vite.config.ts`'s `react()` plugin is what does that transpilation; open it and you'll see it's a two-line file wrapping exactly this. Once you know it's "just a function call that builds a tree of objects describing DOM nodes," a lot of what feels like magic about React stops being magic.

## Props: how data flows *down*

`Header`'s `{ title, subtitle }` are **props** — values a parent passes to a child, read-only from the child's side. `App.tsx` renders `<Header title="1515 Match Scouting" subtitle="..." />`, and that's the entire relationship: `App` decides what `Header` displays, `Header` has no say in it, and `Header` has no way to reach back up and change anything in `App`. Every component in this app works this way, and it's what "one-way data flow" means: data only ever moves down the tree, from a parent's JSX to a child's props, never sideways and never implicitly.

## Events: how data flows *up*

If props only go down, how does typing into a form field ever get back to `App`, which is what actually needs to know a new entry exists? `App` gives `ScoutingForm` a *function* as a prop — `onEntrySaved` — and `ScoutingForm` calls it when it has something to report:

```tsx
// App.tsx
<ScoutingForm onEntrySaved={handleEntrySaved} />

// ScoutingForm.tsx
interface ScoutingFormProps {
  onEntrySaved: (entry: ScoutingEntry) => void;
}
// ...later, once validation passes:
onEntrySaved(saved);
```

`ScoutingForm` never touches `App`'s data directly — it just calls a function `App` handed it, with the new entry as an argument. `App` decides what to actually do with that call (append to `entries`). This callback-prop pattern *is* "events flowing up": the only way data ever travels from a child back to a parent in React.

## Composition, before you reach for global state

`App` renders `<EntryList entries={entries} />`, and `EntryList` renders one `<EntryCard entry={entry} />` per entry. Three components, three levels, and every one of them only knows about the props it was directly handed — `EntryCard` has never heard of `App` and never will. This is **composition**: building a complicated UI out of small components that each do one thing, nested inside each other, with data threaded down through props at each level.

You'll hear about tools for sharing state across a whole app without manually threading it through every level — Context, and later, entire state-management libraries. None of them show up in this app, on purpose: at three shallow levels, plain props are simpler to read, simpler to trace, and introduce nothing extra to learn. `frontend_systems_primer/03_state_as_a_systems_problem` is where that tradeoff actually gets revisited, once the app's shape gives you a real reason to reach for something more than props.

## What React replaced

Compare directly against `01_foundations`'s hand-written version:

| Manual DOM (01/02) | React (03) |
|---|---|
| `document.createElement("article")`, `.appendChild(...)`, one call per node | Describe the tree once, as JSX, in `EntryCard.tsx` |
| `entriesEl.insertBefore(card, ...)` to place a new card correctly | `entries.map(...)` — React figures out what changed and updates the DOM itself |
| `requireElement<T>(id)` to read a value out of the DOM | The component already holds the value — no DOM read needed (see `validation.ts`) |
| One shared, mutable `entries` array everything reached into | `entries` lives in exactly one place (`App`'s state), passed down as a prop everywhere else |

None of `01`'s DOM knowledge is wasted, either — it's exactly what React is doing underneath every one of these components, on your behalf, faster and less error-prone than hand-written `createElement` calls tend to be once an app has more than a handful of elements.

## A brief, honest note about `useState`

`ScoutingForm.tsx` and `App.tsx` both call `useState` — that's how a component holds a value that can change and causes a re-render when it does. You need at least that much for an interactive form to exist at all, so it's here. What `useState` actually is, the rules around calling it, and its sibling `useEffect`, are `04_hooks_and_lifecycle`'s entire subject — treat every `useState` call in this module's code as "a tool being used," not yet "a concept fully explained."

## Putting it together

```text
$ cd scouting_app
$ npm run dev
```

Open the printed URL — it should look and behave identically to `02_why_typescript`'s version. That's deliberate: this module changed *how* the UI gets built, not what it does. Read `App.tsx` first, then follow the tree down through `Header.tsx`, `ScoutingForm.tsx`, `EntryList.tsx`, and `EntryCard.tsx`, tracing every prop as it flows down and every callback as it flows back up.

## Resources

- [React: Your First Component](https://react.dev/learn/your-first-component) - the official starting point, covering exactly what a component is.
- [React: Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component) - props, in more depth than above.
- [React: Lifting State Up](https://react.dev/learn/sharing-state-between-components) - the official name for what `App` does by owning `entries` and handing it down.
- [React: Writing Markup with JSX](https://react.dev/learn/writing-markup-with-jsx) - JSX's actual rules, beyond "it looks like HTML."
