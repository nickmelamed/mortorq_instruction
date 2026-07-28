# Exercise 2: Break the Pick List's Boundary Check (Break This on Purpose)

## Goal
See exactly what an off-by-one array bug actually looks like when it runs, instead of only recognizing the pattern in the abstract.

## Steps
1. In `PickList.tsx`'s `move` function, find this guard:
   ```ts
   if (target < 0 || target >= order.length) return;
   ```
   Temporarily delete it entirely.
2. This app actually checks that boundary in *two* places: the guard you just deleted, and each button's `disabled={index === 0}` / `disabled={index === order.length - 1}`. With only the first one gone, the top row's "Move up" button is still disabled and unclickable — so also temporarily change both `disabled={...}` expressions to `disabled={false}`, to see what the guard alone was actually protecting against.
3. Refresh the app and make sure you have at least two teams scouted, so the pick list has at least two rows.
4. Click the **top row's "Move up" button.**
5. Look at the pick list. What happened to the row count? Add a `console.log(order)` as the first line inside `move` if you want to inspect it directly — what ends up sitting at index `-1` conceptually, and what did JavaScript's array assignment `next[target] = ...` actually do with a `target` of `-1`?
6. Reload the page. Is the corruption still there, or did it go away? (Hint: think about what `savePickListOrder` was called with, and when.)
7. Restore both the guard and the two `disabled` expressions exactly as they were, reload, and confirm the pick list is usable again — you may need to clear `localStorage`'s `scouting-app:pick-list-order` key by hand (dev tools → Application → Local Storage) if step 6's corruption got saved.

## Self-Check
- [ ] I described exactly what the pick list looked like after clicking "Move up" on the top row with both protections removed
- [ ] I can explain what `next[-1] = next[0]` actually did to the array (it is not the same thing as moving an element)
- [ ] I confirmed whether the corruption survived a reload, and why
- [ ] I restored the guard and both `disabled` expressions, and confirmed the pick list works correctly again

## Reflection
The `disabled={index === 0}` attribute and the `target < 0` guard inside `move` check the *same condition*, in two different places — and either one alone would have stopped this bug; it took removing both to actually see it happen. What does that tell you about which of the two is the real safety mechanism, and which one is a UI convenience that happens to enforce the same rule?
