// main.tsx -- the one unavoidable direct DOM query left in the entire
// app: React has to be told which real DOM node to take over. Compare
// this single line to 02_why_typescript's main.ts, which called
// requireElement() three separate times to find the form, the submit
// button, and the status span individually -- every one of those is now
// a piece of App's JSX instead of something looked up by id.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import { App } from "./App.tsx";

const rootEl = document.getElementById("root");
if (rootEl === null) {
  throw new Error('Expected an element with id="root" to exist in index.html.');
}

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
