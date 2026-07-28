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

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Alliance, ScoutingEntry, StoredEntry } from "../types.ts";

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

export async function insertEntry(entry: ScoutingEntry): Promise<StoredEntry> {
  if (client === null) {
    throw new Error("Supabase isn't configured -- see 02_data_beyond_the_spreadsheet/concept.md.");
  }

  const { data, error } = await client
    .from("entries")
    .insert({
      team_number: Number(entry.teamNumber),
      match_number: Number(entry.matchNumber),
      alliance: entry.alliance,
      scouter_name: entry.scouterName,
      notes: entry.notes,
    })
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
