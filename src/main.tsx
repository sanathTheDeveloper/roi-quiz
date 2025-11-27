import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Support both standalone (id="root") and WordPress (id="roi-calculator-root")
const rootElement = document.getElementById("roi-calculator-root") || document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
