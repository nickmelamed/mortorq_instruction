# Exercise 1: Extract a `FormField` Component

## Goal
Notice real duplication, then remove it with composition instead of copy-paste — the actual skill this module is teaching, applied to real code instead of a toy example.

## Scenario
Look closely at `ScoutingForm.tsx`'s team number, match number, and scouter name fields. Each one is the same shape: a `.field` div, a `<label>`, an `<input>`, and an `<p className="error">`, differing only in the id, label text, value, change handler, and error message. That repetition is exactly the kind of thing a component exists to eliminate.

## Steps
1. Create `components/FormField.tsx`. Give it props for whatever actually differs between the three fields above: at minimum an `id`, a `label`, a `value`, an `onChange`, and an `error`.
2. Have `FormField` render the same markup structure currently repeated three times in `ScoutingForm.tsx` — the wrapping `.field` div (with `invalid` conditionally applied, exactly like today), the label, the input, and the error paragraph.
3. Replace the team number, match number, and scouter name fields in `ScoutingForm.tsx` with three `<FormField ... />` uses.
4. Leave the alliance `<select>` and the notes `<textarea>` as they are — they're shaped differently enough (a select's options, a textarea's rows) that forcing them into the same component would make `FormField` more complicated than the duplication it's removing. Recognizing *when not* to extract a component is as much the point as extracting one.
5. Run `npx tsc --noEmit`, then `npm run dev` and confirm all three fields — including their validation errors — still work exactly as before.

## Self-Check
- [ ] `FormField` is used for team number, match number, and scouter name
- [ ] Typing an invalid value into any of the three still shows that field's specific error message
- [ ] `ScoutingForm.tsx` is now visibly shorter than it was
- [ ] I did not try to force the alliance select or notes textarea into `FormField`

## Reflection
`FormField` needs an `onChange` prop typed as `(value: string) => void` (or similar) rather than hardcoding what happens when the value changes. Why does it have to work that way — what would go wrong if `FormField` tried to update `ScoutingForm`'s `draft` state directly instead of calling a prop function?
