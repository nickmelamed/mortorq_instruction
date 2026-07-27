# Exercise 2: Debug the Delete Buttons (Break This on Purpose)

## Goal
Find and fix a real, extremely common DOM/events bug — not by guessing, but by reasoning about *when* code actually runs.

## Scenario
A teammate added a "delete" button to every rendered entry card, so a scout can remove a bad entry. It looks right. It doesn't work right: **clicking any delete button always deletes the last entry in the list**, no matter which card you clicked. Here's their code, added inside `renderEntry()`:

```js
function renderEntry(entry) {
  // ...existing card-building code above...

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  card.appendChild(deleteButton);

  entries.push(entry);

  deleteButton.addEventListener("click", () => {
    const index = entries.length - 1;
    entries.splice(index, 1);
    card.remove();
  });
}
```

## Steps
1. Add this code to your own `renderEntry()` (temporarily — you'll fix it, not keep it) and submit three or four entries.
2. Click the delete button on the *first* card you submitted, not the last one. Watch what actually gets removed from `entries` — add a `console.log(entries)` right before the `splice` call if you need to see it directly.
3. Once you can explain *why* it's always removing the last one, fix it. The fix should make each button remove the specific entry it belongs to, regardless of click order.
4. Confirm: submit five entries, delete the third one you added, and confirm the other four are untouched.

## Self-Check
- [ ] I can state, in one sentence, why `entries.length - 1` was wrong here
- [ ] Deleting an early card doesn't affect any other card
- [ ] Deleting works correctly no matter what order you click the buttons in

## Reflection
The bug isn't that `entries.length - 1` was calculated wrong at the moment it was written — it's that it gets *re-evaluated* at the moment you click, not at the moment `renderEntry()` ran. What does that tell you about when the function passed to `addEventListener` actually executes, relative to the rest of `renderEntry()`? This is the same category of mistake as a stale value in an async callback — worth remembering once you hit `useEffect` in `04_hooks_and_lifecycle`.
