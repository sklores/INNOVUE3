// src/App.tsx
import React from "react";
import TopBar from "./scenic/TopBar";
import { useKpis } from "./app/selectors";
import Marquee from "./features/marquee/Marquee";
import "./styles/global.css";
import "./styles/topbar.css";
import "./styles/kpi.css";
import "./styles/bottom.css";

export default function App() {
  const k = useKpis();

  return (
    <div className="app">
      {/* Scenic Top Bar */}
      <TopBar />

      {/* KPI Grid */}
      <div className="kpi-grid">
        {/* Sales - full width top row */}
        <div className="kpi-tile sales">
          <div className="kpi-label">Sales</div>
          <div className="kpi-value">{k?.sales ?? "—"}</div>
        </div>

        {/* Middle grid: Fixed Cost + A/P */}
        <div className="kpi-tile fixed-cost">
          <div className="kpi-label">Fixed Cost</div>
          <div className="kpi-value">{k?.fixedCost ?? "—"}</div>
        </div>
        <div className="kpi-tile ap">
          <div className="kpi-label">A/P</div>
          <div className="kpi-value">{k?.accountsPayable ?? "—"}</div>
        </div>

        {/* Profit - full width bottom row */}
        <div className="kpi-tile profit">
          <div className="kpi-label">Profit</div>
          <div className="kpi-value">{k?.profit ?? "—"}</div>
        </div>
      </div>

      {/* Marquee with header */}
      <div className="marquee-container">
        <h2 className="marquee-header">GCDC Live Feed</h2>
        <Marquee />
      </div>
    </div>
  );
}