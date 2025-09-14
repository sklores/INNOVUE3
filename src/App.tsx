// src/App.tsx
import React from "react";
import TopBar from "./scenic/TopBar";
import { useKpis, useLastUpdated, useLoadingError } from "./app/selectors";
import KpiTiles from "./features/kpi/KpiTiles";
import Marquee from "./features/marquee/Marquee";

export default function App() {
  const k = useKpis();
  const updated = useLastUpdated();
  const { loading, error } = useLoadingError();

  return (
    <div className="app">
      {/* Scenic hero */}
      <TopBar />

      {/* Header / status */}
      <h1 style={{ marginTop: 36 }}>Innovue 3 — M1 Data Backbone</h1>

      {error && (
        <div
          className="card"
          style={{
            padding: 12,
            border: "1px solid #ffd1d1",
            background: "#fff6f6",
            marginBottom: 12,
          }}
        >
          <strong>Sheets Error:</strong> {error}
        </div>
      )}

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>Last Updated</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>
          {updated ? new Date(updated).toLocaleTimeString() : "—"}
        </div>
      </div>

      {/* GCDC Live Feed (A15–A17 titles toggle, B15–B17 text scroll) */}
      <Marquee />

      {/* KPI tiles (Sales full-width top, 2-col grid mid, Profit full-width bottom) */}
      <KpiTiles />

      {loading && (
        <div style={{ marginTop: 16, color: "var(--muted)" }}>
          Loading from Google Sheets…
        </div>
      )}
    </div>
  );
}