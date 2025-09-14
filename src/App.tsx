// src/App.tsx
import React from "react";
import TopBar from "./scenic/TopBar";
import { useLastUpdated, useLoadingError } from "./app/selectors";
import KpiTiles from "./features/kpi/KpiTiles";
import LiveFeedPanel from "./features/marquee/LiveFeedPanel";

export default function App() {
  const updated = useLastUpdated();
  const { loading, error } = useLoadingError();

  return (
    <div className="app">
      {/* Scenic hero */}
      <TopBar />

      {/* Screen title + quick status */}
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

      {/* KPI layout */}
      <KpiTiles />

      {/* Tall Live Feed (Last Updated is embedded in its header) */}
      <LiveFeedPanel />

      {loading && (
        <div style={{ marginTop: 16, color: "var(--muted)" }}>
          Loading from Google Sheets…
        </div>
      )}
    </div>
  );
}