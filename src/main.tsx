import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Global + feature styles (Manrope is in index.html)
import "./styles/global.css";
import "./styles/topbar.css";
import "./styles/kpi.css";
import "./styles/marquee.css";
import "./styles/bottom.css";

// App provider (context + poller)
import { AppProvider } from "./app/state";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element #root not found");
}

createRoot(container).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);