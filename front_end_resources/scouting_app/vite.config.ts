import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// react() turns JSX in .tsx files into plain React.createElement() calls
// during the dev server/build -- browsers have no idea what JSX is.
export default defineConfig({
  plugins: [react()],
});
