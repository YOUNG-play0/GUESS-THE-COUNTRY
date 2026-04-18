import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/GUESS-THE-COUNTRY/sw.js")
      .then((reg) => console.log("SW OK:", reg))
      .catch((err) => console.log("SW ERROR:", err));
  });
}
