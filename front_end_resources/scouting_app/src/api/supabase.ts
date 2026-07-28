// api/supabase.ts -- optional real persistence. If VITE_SUPABASE_URL and
// VITE_SUPABASE_ANON_KEY aren't set, isConfigured is false and the app
// falls back to the old in-memory-only behavior from api/scouting.ts --
// on purpose. Nobody following along with this primer should hit a
// broken app just because they haven't set up a database yet.
//
// Basic schema thinking: teamNumber and matchNumber are strings in
// ScoutingEntry (convenient for a controlled <input>), but they're
// numbers in the database, because that's what they actually are --
// see schema.sql. Converting at this boundary, once, is the job of
// rowToStoredEntry/entryToRow below, so nothing else in the app has to
// think about the difference.
//
// As of 05_offline_and_multi_user: writes take a StoredEntry (already
// carrying the id api/scouting.ts generated client-side) and upsert
// instead of insert -- see that topic's concept.md for why a stable,
// client-chosen id plus upsert is what makes retrying a queued write
// safe instead of a source of duplicate rows.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Alliance, StoredEntry } from "../types.ts";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const client: SupabaseClient | null = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

interface EntryRow {
  id: string;
  team_number: number;
  match_number: number;
  alliance: Alliance;
  scouter_name: string;
  notes: string;
  created_at: string;
}

function rowToStoredEntry(row: EntryRow): StoredEntry {
  return {
    id: row.id,
    teamNumber: String(row.team_number),
    matchNumber: String(row.match_number),
    alliance: row.alliance,
    scouterName: row.scouter_name,
    notes: row.notes,
  };
}

export async function upsertEntry(entry: StoredEntry): Promise<StoredEntry> {
  if (client === null) {
    throw new Error("Supabase isn't configured -- see 02_data_beyond_the_spreadsheet/concept.md.");
  }

  // upsert, keyed on the id api/scouting.ts already generated -- not
  // insert. If this exact entry was already queued and retried (the
  // request succeeded once before, but the response never made it back
  // before the connection dropped), this lands on the same row instead
  // of creating a second one. insert() has no way to know that; upsert()
  // on a stable id does.
  const { data, error } = await client
    .from("entries")
    .upsert(
      {
        id: entry.id,
        team_number: Number(entry.teamNumber),
        match_number: Number(entry.matchNumber),
        alliance: entry.alliance,
        scouter_name: entry.scouterName,
        notes: entry.notes,
      },
      { onConflict: "id" },
    )
    .select()
    .single();

  if (error) {
    throw new Error(`Could not save entry to Supabase: ${error.message}`);
  }

  return rowToStoredEntry(data as EntryRow);
}

export async function fetchRecentEntries(limit = 50): Promise<StoredEntry[]> {
  if (client === null) {
    throw new Error("Supabase isn't configured -- see 02_data_beyond_the_spreadsheet/concept.md.");
  }

  const { data, error } = await client
    .from("entries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Could not load entries from Supabase: ${error.message}`);
  }

  return (data as EntryRow[]).map(rowToStoredEntry);
}
