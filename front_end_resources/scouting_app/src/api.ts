// api.ts -- still fake. frontend_systems_primer/01_consuming_apis is
// where fakeSubmitToServer gets replaced with a real fetch() call.

// A generic function: <T> is a placeholder for "whatever type gets
// passed in," filled in fresh at each call site. Without it, this
// function would either have to hardcode `entry: ScoutingEntry` (and
// become useless for anything else this app ever fakes-submits) or
// accept `entry: any` (and give up type safety entirely -- see
// exercises/exercise-2-any-hides-a-typo.md for exactly what that costs
// you). With <T>, `fakeSubmitToServer(entry)` where `entry` is a
// ScoutingEntry returns `Promise<ScoutingEntry>`, and TypeScript infers
// that automatically -- you don't write `<ScoutingEntry>` at the call
// site, it's worked out from what you passed in.
export function fakeSubmitToServer<T>(entry: T): Promise<T> {
  return new Promise((resolve) => {
    const delayMs = 400 + Math.random() * 600;
    setTimeout(() => resolve(entry), delayMs);
  });
}
