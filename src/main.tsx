import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// CSS: one global + three feature styles (ordered, no duplicates)
import "./styles/global.css";
import "./styles/topbar.css";
import "./styles/kpi.css";
import "./styles/bottom.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);