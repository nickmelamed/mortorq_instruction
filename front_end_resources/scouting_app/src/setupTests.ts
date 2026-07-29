// setupTests.ts -- runs once before every test file (see vite.config.ts's
// test.setupFiles). This one import is what makes `expect(...).toBeInTheDocument()`,
// `.toHaveTextContent()`, and jest-dom's other DOM-specific matchers
// available -- without it, `expect` only knows the generic matchers
// Vitest ships with, none of which understand what a DOM node is.
import "@testing-library/jest-dom/vitest";

import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Node itself ships a built-in `localStorage` global now, and in this
// jsdom test environment `window` *is* `globalThis` -- there's no
// separate "real" jsdom copy sitting underneath to fall back on.
// Whichever implementation claimed the global slot first wins, and
// Node's version comes up with no backing file configured (see the
// startup warning) and is missing methods as basic as `.clear()` as a
// result. That's a genuine "works differently depending on which Node
// version happens to be installed" bug -- exactly the category
// `general_programming_resources/08_reproducibility` warns about -- and
// this file's fix is to stop depending on either implementation and
// supply a small, deterministic one of our own: enough of the Storage
// interface for offline/pendingQueue.ts and output/pickListStorage.ts to
// work against, nothing more.
class MemoryStorage implements Storage {
  #entries = new Map<string, string>();

  get length(): number {
    return this.#entries.size;
  }

  clear(): void {
    this.#entries.clear();
  }

  getItem(key: string): string | null {
    return this.#entries.has(key) ? this.#entries.get(key)! : null;
  }

  key(index: number): string | null {
    return [...this.#entries.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.#entries.delete(key);
  }

  setItem(key: string, value: string): void {
    this.#entries.set(key, String(value));
  }
}

Object.defineProperty(globalThis, "localStorage", {
  value: new MemoryStorage(),
  configurable: true,
  writable: true,
});

// React Testing Library normally registers this afterEach automatically
// -- but only when it detects Jest's or Vitest's *global* test APIs on
// globalThis. This project deliberately runs Vitest without `test.globals:
// true` (every test file imports describe/it/expect explicitly, the same
// as every other import in this app), so that auto-detection never
// fires, and this has to be done by hand instead. Skipping it doesn't
// error -- it just leaves every previous test's rendered DOM sitting in
// the document, so the next test's queries start finding two of
// everything. See this topic's concept.md.
afterEach(() => {
  cleanup();
});
