// src/App.tsx
import TopBar from "./scenic/TopBar";
import { useLastUpdated, useLoadingError } from "./app/selectors";
import KpiTiles from "./features/kpi/KpiTiles";

export default function App() {
  const updated = useLastUpdated();
  const { loading, error } = useLoadingError();

  return (
    <div className="app">
      {/* Scenic hero with splash + center-docked control pill */}
      <TopBar />

      {/* Status / debug header */}
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

      {/* NEW: KPI tiles with full pastel spectrum bars */}
      <KpiTiles />

      {loading && (
        <div style={{ marginTop: 16, color: "var(--muted)" }}>
          Loading from Google Sheets…
        </div>
      )}
    </div>
  );
}