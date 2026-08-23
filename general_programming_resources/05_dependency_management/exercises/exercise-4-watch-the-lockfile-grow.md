# Exercise 4: Watch the Lockfile Grow

## Goal
Watch transitive dependencies appear in a real, fully-resolved lockfile from a manifest that never named them, and see for yourself what `pip freeze` only approximates and a real lockfile actually guarantees.

## Scenario
This exercise doesn't use `examples/scouting_tool/` — it's about generating a real dependency resolution yourself, from one real package. `requests` (a genuinely widely-used Python HTTP library) is the demonstration: it depends on several other packages whose names you'll never type yourself.

## Steps
1. In a scratch folder anywhere outside this repo, set up a fresh project. If you have `uv` installed: `uv init --bare` followed by `uv add requests`. If not: `python -m venv .venv`, activate it, then `echo requests > requirements.txt` followed by `pip install -r requirements.txt`.
2. Look at your manifest — `pyproject.toml` if you used `uv`, `requirements.txt` if you used `pip`. How many packages does it actually name?
3. Now look at the full resolved picture. With `uv`: open `uv.lock` and count its `name = "..."` entries. With `pip`: run `pip freeze` and count the lines.
4. Name every package from step 3 that you never typed yourself in step 1. This is `concept.md`'s transitive dependencies, made concrete instead of abstract. (`requests` itself doesn't count; you asked for that one directly.)
5. If you used `uv`: open `uv.lock` again and find one package's recorded `hash = "sha256:..."` entry. That hash, not just a version number, is exactly what makes a real lockfile stronger than `pip freeze`'s flat list; it can prove that whatever gets downloaded later is byte-for-byte the same thing that was resolved today, not just a version number that happens to match.

## Self-Check
- [ ] My manifest names exactly one package: `requests`
- [ ] My fully-resolved lockfile/`pip freeze` output names more than one package
- [ ] I can list, by name, every transitive dependency that showed up without me typing it myself
- [ ] (If using `uv`) I found a real hash recorded in `uv.lock` and can explain in one sentence what it protects against that a bare version number can't

## Reflection
Four extra packages installed themselves the moment you asked for one. None of them were wrong, because this is `requests` working as intended. But this is `05`'s left-pad story playing out at a small, harmless scale: you trusted `requests`, and `requests` made a handful of calls on your behalf that you never reviewed individually, the same shape of trust that broke a lot of real projects at once in 2016, over a package eleven lines long. A lockfile doesn't prevent that trust. Unfortunately, nothing can, short of never depending on anything. What it does is make the trust visible and exact, recorded and checkable, instead of implicit and approximate.
