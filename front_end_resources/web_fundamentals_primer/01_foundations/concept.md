# 01 - Foundations: HTML, CSS, and JavaScript

## Start here, and look at what's already in `scouting-form/`

Open `scouting-form/index.html` in a browser right now, before reading anything else below. It's a real, valid HTML file — nothing about it is broken, it loads, and clicking "Submit" doesn't crash anything. It's also close to useless: no layout, no styling, and the submit button reloads the page and throws away whatever you typed. That gap — "technically works" vs. "actually usable" — is this entire topic. HTML gives you structure, CSS gives you presentation, and JavaScript gives you behavior. A page needs all three, and `scouting-form/`'s starting point deliberately only has the first.

## Semantic HTML

"Semantic" just means: pick the tag that describes what something *is*, not just how it looks. A sighted user can tell a heading is a heading because it's big and bold; a screen reader, a search engine, or your own CSS can only tell if you actually used `<h1>` instead of a `<div>` styled to look big and bold.

| Instead of... | Use... | Because... |
|---|---|---|
| `<div class="button">` | `<button>` | gets you keyboard focus, `Enter`-to-activate, and screen-reader announcement for free |
| `<div>` wrapping a whole form | `<form>` | gets you `Enter`-to-submit and the browser's built-in validation hooks |
| `<div>` per input, unlabeled | `<label for="...">` + `<input id="...">` | clicking the label focuses the input; a screen reader announces what the field is for |
| a wall of unrelated `<div>`s | `<header>`, `<main>`, `<fieldset>` | gives structure a browser, a screen reader, and *you*, six months from now, can actually navigate |

None of this changes what renders on screen by default — a `<button>` and a styled `<div>` can look identical. The difference is entirely in what the browser and assistive tech *know* about the element, for free, without you writing a single line of JavaScript to fake it.

## The CSS box model, flexbox, and grid

Every single element on a page is a box, and every box has the same four layers, from the inside out: **content**, **padding** (space inside the border), **border**, and **margin** (space outside the border). The single most common CSS bug beginners hit — "why is this element wider than I told it to be?" — is almost always `box-sizing`: by default, `width` only sets the *content* box, and padding/border get added on top of it. Setting `box-sizing: border-box` (as `styles.css` does, globally, for every element) makes `width` mean the *total* rendered width instead, which is almost always what you actually want.

Once you're past individual boxes, you need to arrange many of them together, and that's what **flexbox** and **grid** are for:

- **Flexbox** arranges children in a single row or column and is built for distributing space along *one axis* — this is what lays out the form's label/input pairs, and the row of buttons at the bottom.
- **Grid** arranges children in rows *and* columns at once and is built for two-dimensional layout — this is what lays out the "Recent Entries" cards once you have more than one.

Rule of thumb: reach for flexbox when you're arranging things in a line, and grid when you're arranging things in a genuine two-dimensional layout. `styles.css` uses both, for exactly those two reasons.

## The DOM, and events

The **DOM** (Document Object Model) is the browser's live, in-memory tree representation of your HTML — not the HTML text file itself, but the actual structure the browser is currently rendering. JavaScript's entire job in this topic is reading from and writing to that tree: `document.querySelector(...)` reads a node out of it, `element.textContent = ...` or `document.createElement(...)` + `appendChild(...)` writes new content into it.

Nothing happens on its own, though — the DOM only changes in response to **events**: a click, a keystroke, a form submission. `element.addEventListener("submit", handler)` is how you say "run this function when this specific thing happens to this specific element." `script.js`'s whole job is one big event listener: intercept the form's `submit` event, read every field's current value out of the DOM, validate it, and if it's valid, build an entry and render it into the page — all without ever letting the browser do its default behavior (reloading the page).

## Async JS: callbacks, promises, and `async`/`await`

A real scouting app can't pretend saving an entry happens instantly — a network request to a server takes real time, and your page has to keep responding to clicks while it waits. This is the exact same problem `systems_primer/01_concurrency_realtime_loops` describes from the robot side: **a blocking call freezes the whole loop**. On a robot, that loop runs every 20ms and everything stops if you block it. In a browser, there's a similar single thread handling rendering and input — a JavaScript function that blocks (say, a `while` loop that spins for five seconds) freezes the *entire page*, including scrolling and clicking, for those five seconds. Nothing else can happen until it returns.

JavaScript's answer is to never block for anything slow. Instead, you hand off the slow thing and get notified when it's done, in one of three equivalent ways that all do the same job:

1. **Callbacks** — pass a function to run later: `setTimeout(() => { ... }, 1000)`. Works, but nesting several of these (do this, *then* when it's done do that, *then* when that's done...) produces what's genuinely called "callback hell."
2. **Promises** — an object representing "a value that will exist eventually, or an error instead," with `.then(...)` to react to it. Cleaner to chain than nested callbacks, still visibly a chain of `.then()`s.
3. **`async`/`await`** — syntax that lets you write promise-based code that *reads* top-to-bottom like it's blocking, while the JavaScript engine underneath handles the "actually don't block" part for you. This is what modern code (including `03_react_core` onward) uses almost exclusively; callbacks and raw `.then()` chains are worth recognizing, not writing by hand once you know `async`/`await`.

`script.js`'s `fakeSubmitToServer(entry)` function is a `Promise` wrapped around a `setTimeout` — a deliberately fake stand-in for a real network request, which is exactly what `frontend_systems_primer/01_consuming_apis` will replace it with. The event handler `await`s it, disabling the submit button and showing "Saving..." the entire time it's pending, so the page stays honest about what's happening instead of looking frozen or letting you double-submit.

## Putting it together

Open `scouting-form/index.html` in a browser again now that you've read the above, then open `scouting-form/styles.css` and `scouting-form/script.js` side by side with it. Walk through `script.js` top to bottom and match every DOM call back to something above: which lines read the DOM, which lines write to it, which lines are the event listener, and which lines are the async save. Once you've done that, move on to `exercises/`.

## Resources

- [MDN: HTML elements reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element) - the full list of semantic tags, beyond the handful used here.
- [MDN: The box model](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model) - a deeper visual walkthrough of content/padding/border/margin.
- [CSS-Tricks: A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) - the reference you'll bookmark and keep coming back to.
- [CSS-Tricks: A Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/) - same, for grid.
- [MDN: Introduction to events](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events) - `addEventListener` and the event object, in more depth than above.
- [MDN: Using Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) - callbacks, promises, and `async`/`await`, covered in full.
