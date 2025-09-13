import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// CSS: single global + feature styles (ordered)
import "./styles/global.css";
import "./styles/topbar.css";
import "./styles/kpi.css";
import "./styles/bottom.css";

import { AppProvider } from "./app/state";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);