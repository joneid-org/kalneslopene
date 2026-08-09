import "./lib/arrayExtensions.ts";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "leaflet/dist/leaflet.css";
import "./App.css";
import App from "./App.tsx";
import { bufferErrorsUntilInitialized } from "./lib/errorTracking.ts";

bufferErrorsUntilInitialized();

// biome-ignore lint/style/noNonNullAssertion: The root element is guaranteed to exist in the HTML file.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
