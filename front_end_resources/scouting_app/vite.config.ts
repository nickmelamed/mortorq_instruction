/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// react() turns JSX in .tsx files into plain React.createElement() calls
// during the dev server/build -- browsers have no idea what JSX is.
export default defineConfig({
  plugins: [react()],
  // As of 07_testing: Vitest reuses this same config (same plugins, same
  // path resolution) instead of needing a second, separate config file --
  // one reason it's the natural test runner for a Vite project, not just
  // a popular one. jsdom stands in for a real browser (a real DOM, but no
  // real rendering) so component tests can run in plain Node.
  test: {
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
  },
});
