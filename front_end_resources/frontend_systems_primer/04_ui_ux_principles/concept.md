# 04 - UI/UX Principles: Fast, Error-Resistant Entry Under Pressure

## The actual constraint this app is designed around

A scouting app isn't used at a desk. It's used standing up, in a loud pit or in the stands, on a phone or tablet, by someone who has somewhere between 30 and 90 seconds between the end of one match and the start of the next to finish an entry before they lose track of what they just watched. That's a real constraint, the same way WPILib's 20ms loop is a real constraint on robot code — and just like that loop, "design for it explicitly" beats "hope it's fine." This topic is three concrete changes to `scouting_app` in service of exactly that constraint, plus the accessibility principles underneath them.

## Touch targets: 44px isn't arbitrary

`style.css` now sets `min-height: 44px` on every input, select, textarea, and button. That number comes from [WCAG 2.5.5](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html) and matches both Apple's and Google's own platform guidance for comfortable tap targets. Below it, a thumb miss-tap stops being a rare accident and becomes routine — exactly the kind of error this whole topic exists to prevent, and exactly the kind of thing that's invisible if you only ever test with a mouse on a laptop. `font-size: 1rem` (16px) on inputs matters for a related, more specific reason: iOS Safari auto-zooms the page when you focus an input with a smaller computed font size, which is its own jarring, error-inducing surprise mid-match.

## The alliance toggle: matching the control to the cost of using it

The alliance field used to be a `<select>` with two options. A `<select>` costs a tap to open, a tap to choose — two actions for a binary choice, and on a touch screen, the open state also covers part of the form you were just looking at. It's now two big, tappable buttons:

```tsx
<fieldset className="alliance-toggle">
  <legend>Alliance</legend>
  <label className="alliance-option alliance-option--red">
    <input className="visually-hidden" type="radio" name="alliance" value="red" ... />
    Red
  </label>
  <label className="alliance-option alliance-option--blue">
    <input className="visually-hidden" type="radio" name="alliance" value="blue" ... />
    Blue
  </label>
</fieldset>
```

Notice these are real `<input type="radio">` elements, not a styled `<div onClick>` pretending to be one — `01_foundations`'s "pick the tag that describes what something *is*" argument, applied again. A real radiogroup gets arrow-key navigation and correct screen-reader announcement ("Red, radio button, 1 of 2") for free, entirely from the browser, with zero JavaScript written for it. The radio inputs themselves are visually hidden with a `.visually-hidden` utility class — **not** `display: none`. That distinction matters: `display: none` removes an element from the tab order and from assistive technology entirely, while the visually-hidden pattern (an old, standard trick — position it absolutely, clip it to 1px, keep it in the document) removes it only from the visual layout. The `<label>` around it is what's actually styled to look like a button; clicking anywhere in the label still toggles the real input underneath, because that's what labels and inputs do together natively.

## Refocus after submit: closing the loop for repeated entry

After a successful save, `ScoutingForm` now calls `teamNumberInputRef.current?.focus()` — the same ref `04_hooks_and_lifecycle`'s "press n to jump to team number" shortcut already used. A scout entering a dozen matches in a row from one station shouldn't have to reach for a mouse, or hunt for the right field on a tablet, after every single submission. This is a small change with an outsized effect on actual time-per-entry, which is the metric that matters here — not "does the form work," but "how fast can someone use it correctly, repeatedly, under pressure."

## Accessibility as information hierarchy, not decoration

Every field with a validation error now carries `aria-invalid` and `aria-describedby` pointing at that field's specific error message:

```tsx
<input
  ...
  aria-invalid={Boolean(errors.teamNumber)}
  aria-describedby="team-number-error"
/>
<p className="error" id="team-number-error">{errors.teamNumber}</p>
```

Visually, this changes nothing — the error text was already right there, right below the field. What it changes is what a screen reader announces: without this, a screen reader user tabbing into an invalid field hears only the label, with no indication anything is wrong or why, and has to hunt separately for an error message that a sighted user sees instantly, adjacent to the field. `aria-describedby` is the programmatic version of "the error text is right below the input" — it makes an already-existing visual relationship explicit for anyone who can't see it. This is the same "information hierarchy" idea in miniature: the error is the single most important thing about that field at that moment, and every user — sighted or not — should get that priority communicated to them immediately, not after searching.

## Putting it together

```text
$ cd scouting_app
$ npm run dev
```

Resize your browser down to a narrow phone width (or open dev tools' device toolbar) and confirm the alliance buttons stack vertically and remain comfortably tappable. Submit an entry and confirm focus jumps back to the team number field automatically. Then try tabbing through the form with your keyboard alone, with your mouse untouched: confirm you can reach and select an alliance with arrow keys, and that an invalid field's error is something you'd actually notice without looking at the screen.

## Resources

- [WCAG 2.1: Target Size (Level AAA)](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html) - the 44×44px guidance behind this topic's touch-target sizing.
- [MDN: ARIA: describedby](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby) - the full behavior of the attribute used to link inputs to their error messages.
- [The A11Y Project: CSS `visually-hidden`](https://www.a11yproject.com/posts/how-to-hide-content/) - the exact hiding pattern used for the alliance toggle's real radio inputs, and why `display: none` doesn't substitute for it.
- [Nielsen Norman Group: Mobile Form Design](https://www.nngroup.com/articles/mobile-form-design/) - broader mobile form UX principles beyond what this topic covers.
