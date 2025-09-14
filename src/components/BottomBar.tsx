import React from "react";
import { useLastUpdated } from "../app/selectors";
import { refreshNow } from "../app/state";

const pill = (children: React.ReactNode, ok = false) => (
  <div
    style={{
      background: ok ? "#e8fff3" : "#f2f4f8",
      border: `1px solid ${ok ? "#b6edd3" : "#d6dde6"}`,
      borderRadius: 999,
      padding: "8px 12px",
      fontWeight: 700,
      color: "#0b1220",
    }}
  >
    {children}
  </div>
);

const BottomBar: React.FC = () => {
  const updated = useLastUpdated();
  const timeText = updated ? new Date(updated).toLocaleTimeString() : "—";

  const handleRefresh = async () => {
    try {
      await refreshNow();
    } catch {
      window.location.reload();
    }
  };

  return (
    <section
      aria-label="Bottom status bar"
      style={{
        marginTop: 16,
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: 12,
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {pill(
          new Date().toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
          })
        )}
        {pill(<>Last Updated: {timeText}</>)}
        {pill("API OK", true)}
      </div>

      <button
        onClick={handleRefresh}
        style={{
          background: "#f2f4f8",
          border: "1px solid #d6dde6",
          borderRadius: 999,
          padding: "8px 14px",
          fontWeight: 800,
          cursor: "pointer",
        }}
      >
        Refresh
      </button>
    </section>
  );
};

export default BottomBar;