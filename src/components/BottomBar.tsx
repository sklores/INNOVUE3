import React, { useMemo } from "react";
// ✅ Import from app selectors (not "./state")
import { useDateTime, useLastUpdated, useWeather } from "../app/selectors";

/**
 * Sticky bottom status bar (safe):
 *  - Date from shared clock
 *  - Weather (null-safe; shows "—" if unavailable)
 *  - API status (green once Sheets has returned at least once)
 * No refresh button.
 */
const BottomBar: React.FC = () => {
  const now = useDateTime();
  const updated = useLastUpdated();
  const wx = useWeather(); // unknown | null (stub for now)

  const dateLabel = useMemo(() => {
    const d = new Date(now);
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }, [now]);

  const weatherLabel = useMemo(() => {
    if (!wx || typeof wx !== "object") return "—";
    const obj = wx as Record<string, unknown>;
    const condition =
      typeof obj.condition === "string" && obj.condition.trim().length
        ? (obj.condition as string)
        : "—";
    const t =
      typeof obj.tempC === "number" && Number.isFinite(obj.tempC as number)
        ? Math.round(obj.tempC as number)
        : null;
    return t != null ? `${condition} · ${t}°` : condition;
  }, [wx]);

  const apiOk = Boolean(updated);

  return (
    <footer className="bb sticky-bar" aria-label="Bottom Status">
      <div className="bb inner">
        <div className="bb pill">{dateLabel}</div>
        <div className="bb pill">{weatherLabel}</div>
        <div className={`bb pill ${apiOk ? "ok" : ""}`}>
          {apiOk ? "API OK" : "API —"}
        </div>
      </div>
    </footer>
  );
};

export default BottomBar;