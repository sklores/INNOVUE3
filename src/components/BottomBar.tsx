import React, { useMemo } from "react";
import { useDateTime, useWeather, useLastUpdated } from "../app/selectors";

/**
 * Sticky bottom status bar (live):
 *  - Date (from shared clock)
 *  - Weather condition + temp (Open-Meteo)
 *  - API status (green once Sheets has returned at least once)
 * No refresh button here.
 */
const BottomBar: React.FC = () => {
  const now = useDateTime();
  const wx = useWeather();
  const updated = useLastUpdated();

  const dateLabel = useMemo(() => {
    const d = new Date(now);
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }, [now]);

  const weatherLabel = useMemo(() => {
    if (!wx) return "—";
    const t = wx.tempC != null ? Math.round(wx.tempC) : null;
    // If you prefer °F in the UI: const f = t != null ? Math.round(t * 9/5 + 32) : null;
    return t != null ? `${wx.condition} · ${t}°` : wx.condition || "—";
  }, [wx]);

  const apiOk = Boolean(updated);

  return (
    <footer className="bb sticky-bar" aria-label="Bottom Status">
      <div className="bb inner">
        <div className="bb pill">{dateLabel}</div>
        <div className="bb pill">{weatherLabel}</div>
        <div className={`bb pill ${apiOk ? "ok" : ""}`}>{apiOk ? "API OK" : "API —"}</div>
      </div>
    </footer>
  );
};

export default BottomBar;