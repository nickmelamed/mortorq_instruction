# 02 - The Data Layer: Where Data Goes Next

This topic covers two things, both deliberately shallow: **why and how you'd persist scouting data past a spreadsheet**, and **how that same data could feed an LLM for decision support**. Neither section is a full course. The goal is that you see the shape of each problem clearly enough to go deeper later, not that you become an expert in Postgres or prompt engineering today.

## Part 1: A database, briefly

### Why a spreadsheet stops being enough

A shared Google Sheet (`01_consuming_apis`'s CSV workflow is exactly this, one export behind) works fine for one scout at one laptop. It stops working the moment you actually need what a real backend gives you: many scouts writing at once without overwriting each other's rows, a real query ("every entry for team 1515, newest first") instead of scrolling and `Ctrl+F`, and data that survives past whatever happens to that one spreadsheet. `entries` in this app, right up through `01_consuming_apis`, has had exactly the spreadsheet's core limitation: it lives in one browser tab's memory and is gone the instant that tab closes.

### Basic schema thinking

`schema.sql` (new in `scouting_app/`, run once against your own database — see Putting It Together) defines exactly one table:

```sql
create table entries (
  id uuid primary key default gen_random_uuid(),
  team_number integer not null,
  match_number integer not null,
  alliance text not null check (alliance in ('red', 'blue')),
  scouter_name text not null,
  notes text not null default '',
  created_at timestamptz not null default now()
);
```

Notice `team_number` and `match_number` are `integer` here, not `text` — even though `ScoutingEntry` in this app has always stored them as strings. That's not an inconsistency; it's two different concerns doing their job correctly. A controlled `<input>`'s value is always a string, full stop, and `validateEntry` already does the work of confirming that string is really digits before anything downstream trusts it. Once the data is actually being stored, though, it should be stored as what it really is — a number — so the database itself can enforce that, sort by it numerically, and refuse to store the word "seventeen" in that column. `api/supabase.ts`'s `rowToStoredEntry` and the insert call are where that conversion happens, once, at the exact boundary between "the app's world" and "the database's world."

### Supabase: just enough to get data in and out

[Supabase](https://supabase.com/) is a hosted Postgres database with a REST-ish JS client on top — free to start, and closer to "a real SQL database" than a fully managed NoSQL store, which matters for the schema-thinking point above. `api/supabase.ts` does exactly two things: `insertEntry` (one row in) and `fetchRecentEntries` (rows out, newest first). That's the entire surface this lesson needs; Supabase can do a great deal more, and none of it belongs here.

**Row Level Security** is worth naming even in a shallow pass: Supabase blocks every query by default until a policy explicitly allows it, and `schema.sql`'s two policies allow anyone holding your project's public "anon" key to read and insert — appropriate for a team tool behind an unlisted URL with no login system, and explicitly *not* what you'd ship for a product with real user accounts and private data. That distinction — anon key vs. a real per-user auth system — is the entire reason this app still has no login screen; adding one is out of scope here, and a real one is a different, harder lesson.

### Graceful fallback, on purpose

`api/scouting.ts`'s `saveEntry` checks `isSupabaseConfigured` and picks a path: a real insert if you've set `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`, or the exact same in-memory fake from every prior module if you haven't. `App.tsx`'s data-source banner tells you which one is active. This matters for the same reason `01_consuming_apis`'s CSV fallback did: **this app has to keep working for someone who hasn't set up a database yet**, not silently break. `01`'s error message pointed at what to fix; here, not configuring a database at all is a fully supported, fully working state — this primer never breaks the app to make you set something up.

## Part 2: A light teaser — scouting notes as LLM input

### The shape of the problem

A scout's free-text notes ("fast cycles, missed two climb attempts") are exactly the kind of unstructured, inconsistent, human-written data an LLM is good at turning into something structured: a playstyle summary, a list of strengths and weaknesses, a pick-list rationale. `scripts/summarize-team.ts` does exactly this — it's a real, runnable script, not pseudocode, using the official Anthropic SDK's `output_config.format` to constrain the response to a fixed JSON shape:

```ts
output_config: {
  format: {
    type: "json_schema",
    schema: {
      type: "object",
      properties: {
        playstyleSummary: { type: "string" },
        strengths: { type: "array", items: { type: "string" } },
        weaknesses: { type: "array", items: { type: "string" } },
        pickListRationale: { type: "string" },
      },
      required: ["playstyleSummary", "strengths", "weaknesses", "pickListRationale"],
      additionalProperties: false,
    },
  },
},
```

This is the same "define the shape you're willing to accept" idea `02_why_typescript`'s `ValidationResult` used — except here, the shape is enforced on an LLM's output instead of checked by TypeScript's compiler. "Form input in, AI-assisted decision support out" is the whole line this teaser is meant to show you: raw scout notes go in as a prompt, structured pick-list input comes back out.

### Why this is a script, not a component

This is the one point in this entire primer where the *right* answer is "don't build this into the React app." Look at where `scripts/summarize-team.ts` lives: `scouting_app/scripts/`, not `scouting_app/src/`. That's deliberate — nothing under `src/` imports it, so Vite never bundles it into the JavaScript your browser downloads. If this same code lived in a component and called the Claude API directly from the browser, your API key would have to travel to the browser to make that call — and at that point it isn't a secret anymore. Anyone could open dev tools, look at the Network tab, and read it straight out of a request header, or find it sitting in plain text inside your deployed JS bundle. A script that runs on your own machine (or, eventually, on a real backend server you control) and reads its key from an environment variable never sends that key anywhere near a browser. This is the single most important lesson in this whole topic, and it's a systems lesson, not an AI one: **client-side code cannot keep a secret.**

### Getting a key, and what this teaser doesn't cover

Get a key at [console.anthropic.com](https://console.anthropic.com/) and export it as `ANTHROPIC_API_KEY` in your shell before running the script. This is intentionally a teaser: no retrieval, no vector database, no multi-turn conversation, no agent loop — just one prompt in, one structured response out. If your team wants to go further with this later (summarizing a whole event's worth of notes, building a real pick-list assistant), that's a genuinely deeper project than this primer's scope.

## Putting it together

**Database:**
1. Create a free project at [supabase.com](https://supabase.com/).
2. In your project's SQL Editor, paste and run `scouting_app/schema.sql`.
3. From your project's API settings, copy the Project URL and the `anon` public key into `scouting_app/.env.local` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Restart `npm run dev`. The banner at the top of the app should now say it's connected, and entries should survive a refresh.

**LLM teaser:**

```text
$ cd scouting_app
$ ANTHROPIC_API_KEY=sk-ant-... npm run summarize -- 1515 "fast cycles, missed two climb attempts" "played strong defense in quarters"
```

## Resources

- [Supabase: JavaScript client docs](https://supabase.com/docs/reference/javascript/introduction) - the full API `api/supabase.ts` uses a small slice of.
- [Supabase: Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) - the policy system `schema.sql` configures.
- [Anthropic: Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) - the full documentation behind `output_config.format`.
