// output/pickListStorage.ts -- where the pick list's ranking lives.
// Deliberately localStorage, deliberately not Supabase: this is one
// device's working ranking, not shared team state. Making a pick list
// something every strategist's device stays in sync on is a real,
// harder problem -- exactly the shape 05_offline_and_multi_user already
// built tools for -- and a natural extension of this topic, not
// something this topic builds. See concept.md.

const STORAGE_KEY = "scouting-app:pick-list-order";

export function getPickListOrder(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function savePickListOrder(order: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
}
