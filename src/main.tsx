import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

import "./styles/global.css";
import "./styles/topbar.css";
import "./styles/kpi.css";
import "./styles/marquee.css";
import "./styles/bottom.css";

import { AppProvider } from "./app/state";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Missing #root");

createRoot(rootEl).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);