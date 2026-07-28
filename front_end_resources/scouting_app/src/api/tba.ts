// api/tba.ts -- a typed client for the one TBA endpoint this app needs:
// the list of teams at an event. Real HTTP, real auth, real failure
// modes -- everything 05_apis_networking in systems_primer described
// conceptually (a GET request, a status code, a JSON body), now against
// a real backend this app doesn't control.

import type { TbaTeam } from "./types.ts";

const TBA_BASE_URL = "https://www.thebluealliance.com/api/v3";
const REQUEST_TIMEOUT_MS = 8000;

export class TbaRequestError extends Error {}

// A team's endpoint is "/event/{eventKey}/teams/simple" -- "simple"
// asks TBA to return only a handful of fields per team instead of the
// dozens it actually knows, which is both faster to transfer and
// exactly what TbaTeam declares it needs.
export async function fetchEventTeams(eventKey: string, authKey: string): Promise<TbaTeam[]> {
  if (authKey.trim().length === 0) {
    throw new TbaRequestError(
      "No TBA API key configured. Set VITE_TBA_AUTH_KEY in scouting_app/.env.local -- see 01_consuming_apis/concept.md.",
    );
  }

  // The exact defensive pattern systems_primer/08_error_handling_
  // fault_tolerance argued for by hand: never wait indefinitely for
  // something that might not come back. AbortController turns an
  // unbounded wait into a bounded one -- 8 seconds, then give up
  // cleanly instead of leaving the UI stuck in "loading" forever.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${TBA_BASE_URL}/event/${encodeURIComponent(eventKey)}/teams/simple`, {
      headers: { "X-TBA-Auth-Key": authKey },
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new TbaRequestError(`Request to The Blue Alliance timed out after ${REQUEST_TIMEOUT_MS}ms.`);
    }
    throw new TbaRequestError("Could not reach The Blue Alliance -- check your network connection.");
  } finally {
    clearTimeout(timeoutId);
  }

  if (response.status === 401) {
    throw new TbaRequestError("The Blue Alliance rejected this API key (401). Double-check VITE_TBA_AUTH_KEY.");
  }

  if (response.status === 404) {
    throw new TbaRequestError(`No event found with key "${eventKey}". Event keys look like "2024casj".`);
  }

  if (!response.ok) {
    throw new TbaRequestError(`The Blue Alliance returned an unexpected error (${response.status}).`);
  }

  return response.json() as Promise<TbaTeam[]>;
}
