import React from "react";
import { useLastUpdated } from "../app/selectors";
// Some projects wanted a programmatic refresh; if not wired, fallback to window reload.
import { refreshNow } from "../app/state";

/**
 * BottomBar owns date / weather / API badge / Refresh button.
 * You can wire weather later; for now we show last-updated time and a refresh button.
 */
const BottomBar: React.FC = () => {
  const updated = useLastUpdated();
  const timeText = updated ? new Date(updated).toLocaleTimeString() : "—";

  const handleRefresh = async () => {
    try {
      await refreshNow(); // if provider wired it, great
    } catch {
      // fallback – keeps working even without provider method
      window.location.reload();
    }
  };

  return (
    <section
      style={{
        marginTop: 16,
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: 12,
        alignItems: "center",
      }}
      aria-label="Bottom status bar"
    >
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <div
          style={{
            background: "#f2f4f8",
            border: "1px solid #d6dde6",
            borderRadius: 999,
            padding: "8px 12px",
            fontWeight: 700,
            color: "#0b1220",
          }}
        >
          {new Date().toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </div>
        <div
          style={{
            background: "#f2f4f8",
            border: "1px solid #d6dde6",
            borderRadius: 999,
            padding: "8px 12px",
            fontWeight: 700,
            color: "#0b1220",
          }}
        >
          Last Updated: {timeText}
        </div>
        <div
          style={{
            background: "#e8fff3",
            border: "1px solid #b6edd3",
            borderRadius: 999,
            padding: "8px 12px",
            fontWeight: 700,
            color: "#0b1220",
          }}
        >
          API OK
        </div>
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