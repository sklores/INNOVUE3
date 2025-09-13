// src/App.tsx
import TopBar from "./scenic/TopBar";
import { useKpis, useLastUpdated, useLoadingError } from "./app/selectors";

export default function App() {
  const k = useKpis();
  const updated = useLastUpdated();
  const { loading, error } = useLoadingError();

  return (
    <div className="app">
      {/* M2: Scenic hero with splash + center-docked control pill */}
      <TopBar />

      {/* M1: Data Backbone debug view */}
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

      <div className="row">
        {[
          ["Sales", k?.sales],
          ["Profit", k?.profit],
          ["Labor %", k?.laborPct],
          ["COGS", k?.cogs],
          ["Online Views", k?.onlineViews],
          ["Review Score", k?.reviewScore],
          ["Fixed Cost", k?.fixedCost],
          ["A/P", k?.accountsPayable],
          ["Bank", k?.bankBalance],
          ["New Items", k?.newItems],
        ].map(([label, value]) => (
          <div key={label as string} className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{label}</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{value ?? "—"}</div>
          </div>
        ))}
      </div>

      {loading && (
        <div style={{ marginTop: 16, color: "var(--muted)" }}>
          Loading from Google Sheets…
        </div>
      )}
    </div>
  );
}