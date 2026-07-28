import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const rootEl = document.getElementById("root");
if (rootEl === null) {
  throw new Error('Expected an element with id="root" to exist in index.html.');
}

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
