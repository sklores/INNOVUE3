// src/features/marquee/LiveFeedPanel.tsx
// Innovue 3 — Live Feed panel (old look, taller rail, NO animation)
// Data stays exactly as wired via selectors: titles = A15–A17, text = B15–B17.

import React, { useEffect, useMemo, useState } from "react";
import { useFeed, useLastUpdated } from "../../app/selectors";

const SPLIT_REGEX = /-{3,}|—{2,}|–{2,}/g; // handles "-----" and long dashes

const LiveFeedPanel: React.FC = () => {
  const feed = useFeed();
  const updated = useLastUpdated();

  // remember selected tab locally
  const [idx, setIdx] = useState<number>(() => {
    const saved = Number(localStorage.getItem("liveFeedTab") ?? "0");
    return Number.isFinite(saved) ? saved : 0;
  });
  useEffect(() => {
    localStorage.setItem("liveFeedTab", String(idx));
  }, [idx]);

  // Titles from A15–A17
  const titles = feed?.titles ?? ["Social", "Reviews", "Bank"];

  // Current text (from B15–B17) -> split into parts -> join as one line
  const text = (feed?.texts?.[idx] ?? "").trim();
  const line = useMemo(() => {
    if (!text) return "";
    const parts = text
      .split(SPLIT_REGEX)               // split on dashed separators
      .map(s => s.replace(/\s+/g, " ").trim())
      .filter(Boolean);
    return parts.join(" • ");           // single continuous line
  }, [text]);

  const lastTime = updated ? new Date(updated).toLocaleTimeString() : "—";

  return (
    <section className="lf card" role="region" aria-label="GCDC Live Feed">
      {/* Header: Last Updated + Live label (left) and badge (right) */}
      <div className="lf-header">
        <div className="lf-header-left">
          <span className="lf-upd-label">Last Updated</span>
          <span className="lf-upd-time">{lastTime}</span>
          <span className="lf-dot" aria-hidden />
          <span className="lf-title">GCDC Live Feed</span>
        </div>

        <div className="lf-badge" aria-hidden>
          <div className="lf-badge__medal" />
        </div>
      </div>

      {/* Centered pill tabs (A15–A17) */}
      <div className="lf-tabs" role="tablist" aria-label="Feed toggles">
        {titles.map((t, i) => (
          <button
            key={`tab-${i}`}
            role="tab"
            aria-selected={idx === i}
            className="lf-tab"
            onClick={() => setIdx(i)}
            title={t || `Feed ${i + 1}`}
          >
            {t || `Feed ${i + 1}`}
          </button>
        ))}
      </div>

      {/* Tall blue rail — single line, no animation */}
      <div className="lf-rail">
        <div className="lf-line" title={line}>
          {line || "No items yet"}
        </div>
      </div>

      {/* Small status chips row (optional: keep empty if you don’t use it yet) */}
      <div className="lf-stats">
        {/* Example placeholders (comment out/remove if not needed)
        <span className="lf-chip"><span className="dot ok" /> Mentions: 27</span>
        <span className="lf-chip"><span className="dot ok" /> New Reviews: 5</span>
        <span className="lf-chip"><span className="dot ok" /> Links Clicked: 92</span>
        */}
      </div>

      {/* Bottom status row */}
      <div className="lf-bottom">
        <div className="lf-status-left">
          <div className="lf-pill-status">Tue, Sep 9</div>
          <div className="lf-pill-status">Cloudy · —°</div>
          <div className="lf-pill-status ok">API OK</div>
        </div>
        <button className="lf-button" onClick={() => window.location.reload()}>
          Refresh
        </button>
      </div>
    </section>
  );
};

export default LiveFeedPanel;