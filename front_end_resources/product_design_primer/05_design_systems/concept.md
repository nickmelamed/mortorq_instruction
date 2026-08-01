# 05 - Design Systems: A File That Gets Imported, Not a Document That Gets Read

## The bug this module exists to prevent

`frontend_systems_primer/04_ui_ux_principles`'s own exercises point at a real inconsistency: `scouting_app`'s main form got `min-height: 44px` and a 16px font floor, but `TeamLookup.tsx`'s inputs lived in a separate CSS scope (`.team-lookup-source`) that never got the same treatment, because nothing forced the two to share a value — someone had to notice the drift by eye. That's what happens without a design system: every color, size, and spacing value gets hardcoded wherever it's needed, and consistency depends entirely on everyone remembering every other place the same value appears. A design system's whole job is to make that drift structurally impossible instead of relying on memory.

## What makes it a system instead of a spec

A slide deck of "brand colors" that nobody's stylesheet actually references isn't a design system — it's documentation of a decision, disconnected from the code that needs to obey it. A real one is small and boring on purpose: a single file of **tokens** (named values — colors, spacing steps, type sizes) that the actual app imports, so that changing one value in one place changes it everywhere it's used. For a project this size, that's realistically a handful of CSS custom properties:

```css
:root {
  --color-alliance-red: #c0392b;
  --color-alliance-blue: #2980b9;
  --color-text: #1a1a1a;
  --color-bg: #ffffff;

  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;

  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.25rem;

  --touch-target-min: 44px;
}
```

Notice `--touch-target-min` sitting alongside colors and spacing — a design system isn't only visual. It's every value a design decision established that more than one place in the app needs to agree on, including constraints like `04_ui_ux_principles`'s 44px rule. If that value had been a token from the start, `TeamLookup`'s inputs couldn't have quietly fallen out of sync with the main form's — every rule referencing `var(--touch-target-min)` moves together, by construction.

## Components: the next layer, built from tokens, not around them

Once tokens exist, components (a button style, an input style, a card) should be built by referencing them, not by restating raw values. `.alliance-option` should use `var(--space-2)` for its padding, not `16px` typed directly — the difference is invisible today and load-bearing the day someone needs to change the spacing scale and finds forty places that all independently guessed the same number.

## Putting it together

Turn `04`'s color, type, and spacing decisions into an actual tokens file — CSS custom properties, following the shape above — sized to what you'd realistically need for the pick-list screen (or whatever screen you've carried through this primer). Then open `scouting_app`'s real `style.css` and find two or three existing hardcoded values (a color, a spacing number, a font size) that could be replaced by one of your tokens without changing how anything looks. You don't have to make the edit — identifying exactly where the drift risk already lives is the point.

## Resources

- [MDN: Using CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) - the mechanics of the token format used above.
- [Design Systems Handbook, by DesignBetter (InVision)](https://www.designbetter.co/design-systems-handbook) - a fuller treatment of tokens, components, and governance for teams larger than this one.
- [Nathan Curtis: Naming Tokens in Design Systems](https://medium.com/eightshapes-llc/naming-tokens-in-design-systems-9e86c7444676) - practical guidance on the naming problem (`--color-alliance-red` vs. `--color-red-500`) once a token set grows past a handful of values.
