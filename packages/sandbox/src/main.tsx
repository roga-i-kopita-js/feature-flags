import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const root = document.getElementById("root");
if (!root) {
  throw new Error("root element must be defined");
}
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
