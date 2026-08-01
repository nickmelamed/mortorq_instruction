# 04 - Visual Design Fundamentals: Decisions With Reasons, Not Preferences

## Why this module isn't "pick colors you like"

`frontend_systems_primer/04_ui_ux_principles` set `min-height: 44px` on every input for a stated reason: below it, mis-taps stop being rare and become routine. Every visual decision in this module should be justifiable the same way — in terms of legibility, hierarchy, or meaning — not "it looked nice." If you can't finish the sentence "I chose this because ___" with something other than a preference, it's not ready yet.

## Color: contrast and meaning, not mood

Two color jobs matter here, and neither is about mood:

**Contrast, because this app gets used outdoors.** `01`'s needs statement work should have surfaced that a scout is reading this screen in bright, sometimes direct sunlight — glare that washes out low-contrast text far more aggressively than it does on a laptop indoors. WCAG's contrast guideline (4.5:1 for normal text, 3:1 for large text) is a checkable number, not a suggestion — run any text/background pair through a contrast checker before deciding it's legible enough.

**Color as information, not decoration.** `scouting_app`'s alliance toggle uses red and blue because that's what those colors *mean* in FRC — an alliance color swap would be actively confusing, not a style choice. When you pick a color for something, ask what it's communicating (status, category, a warning) before asking whether it's pleasant. A color with no meaning attached is just noise competing with the colors that do mean something.

## Type: a small scale, used for hierarchy

Pick 3-4 sizes total, related by a consistent ratio (1.25x is a common, unremarkable choice), and use size plus weight — not color alone — to signal what matters most on a screen scanned in a hurry. A scout glancing at the form for a second between plays should be able to tell the team-number field is the important one before reading a single label, purely from how much visual weight it carries relative to everything else. More than a handful of sizes stops being a hierarchy and starts being noise; if everything is emphasized, nothing is.

## Spacing: a scale, and why consistency beats any specific number

Pick a base unit (8px is a common, arbitrary-but-fine choice) and use only multiples of it (8, 16, 24, 32) for padding, margins, and gaps. The specific unit matters less than the fact that it's a fixed, small set of values used everywhere — that consistency is what makes a layout read as *intentional* rather than assembled field-by-field. `01_user_needs_and_problem_framing`'s audit exercise pointed at a real version of the alternative: `scouting_app`'s `TeamLookup` component ended up with its own separate CSS scope that drifted from the main form's, because there was no shared scale forcing them to agree. A spacing scale is the thing that prevents that drift before it happens, not a fix applied after someone notices.

## Putting it together

Take the pick-list wireframe from `02` (or your own screen) and apply an actual hi-fi treatment: 3-4 colors with contrast ratios you've checked against WCAG's numbers and can state a reason for each, a 3-4-step type scale used to establish what's most important on the screen, and a spacing scale (a short list of values) applied consistently across every gap and padding on the screen. You can describe this in a table/markdown doc if you don't have a design tool — the deliverable is the decisions and their reasons, not the tool used to render them.

## Resources

- [WebAIM: Contrast Checker](https://webaim.org/resources/contrastchecker/) - the exact tool to check color pairs against WCAG's numeric contrast requirements.
- [Refactoring UI, by Adam Wathan & Steve Schoger](https://www.refactoringui.com/) - a practical, decision-driven treatment of exactly this module's territory (color, type, spacing) aimed at people who don't consider themselves designers.
- [Material Design: The Type System](https://m3.material.io/styles/typography/overview) - a real, shipped type-scale system, useful as a worked example of "a small set of sizes, used for hierarchy."
