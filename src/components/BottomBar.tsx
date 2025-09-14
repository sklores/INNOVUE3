import React, { useMemo } from "react";
import { useLastUpdated } from "../app/selectors";

/**
 * Sticky bottom status bar
 * - Left → three pills: Day/Date • Weather • API status
 * - No refresh button (per request)
 * - No data-layer changes — weather is a placeholder you can later wire to your selector
 */
const BottomBar: React.FC = () => {
  const updated = useLastUpdated();

  // Date pill: e.g., "Sun, Sep 14"
  const dateLabel = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }, []);

  // Weather placeholder until wired (you can replace with useWeather() later)
  const weatherLabel = "Cloudy · —°";

  // API status: green if we've ever fetched; neutral if not yet
  const apiOk = Boolean(updated);
  const apiLabel = apiOk ? "API OK" : "API —";

  return (
    <footer className="bb sticky-bar" aria-label="Bottom Status">
      <div className="bb inner">
        <div className="bb pill">{dateLabel}</div>
        <div className="bb pill">{weatherLabel}</div>
        <div className={`bb pill ${apiOk ? "ok" : ""}`}>{apiLabel}</div>
      </div>
    </footer>
  );
};

export default BottomBar;