import React, { useMemo } from "react";
import { useDateTime, useLastUpdated } from "../app/selectors";

/**
 * Sticky bottom status bar (no weather dependency):
 *  - Date from shared clock
 *  - Weather pill shows "—" for now (we'll wire it in a separate slice)
 *  - API status (green once Sheets has returned at least once)
 * No refresh button.
 */
const BottomBar: React.FC = () => {
  const now = useDateTime();
  const updated = useLastUpdated();

  const dateLabel = useMemo(() => {
    const d = new Date(now);
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }, [now]);

  const weatherLabel = "—"; // placeholder only; prevents crashes until weather is wired

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