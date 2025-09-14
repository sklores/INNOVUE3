// src/features/marquee/LiveFeedPanel.tsx
import React, { useMemo, useState, useEffect } from "react";
import { useFeed, useLastUpdated } from "../../app/selectors";

const SPLIT_REGEX = /-{3,}|—{2,}|–{2,}/g; // handles "-----" and long dashes

const LiveFeedPanel: React.FC = () => {
  const feed = useFeed();
  const updated = useLastUpdated();
  const [idx, setIdx] = useState<number>(() => {
    const saved = Number(localStorage.getItem("liveFeedTab") ?? "0");
    return Number.isFinite(saved) ? saved : 0;
  });

  useEffect(() => {
    localStorage.setItem("liveFeedTab", String(idx));
  }, [idx]);

  const titles = feed?.titles ?? ["Feed A", "Feed B", "Feed C"];
  const text = (feed?.texts?.[idx] ?? "").trim();

  const items = useMemo(() => {
    if (!text) return ["No items yet"];
    return text
      .split(SPLIT_REGEX)
      .map(s => s.replace(/\s+/g, " ").trim())
      .filter(Boolean);
  }, [text]);

  return (
    <section className="lf card" role="region" aria-label="GCDC Live Feed">
      {/* Header row: Last Updated + Title + Tabs */}
      <div className="lf-header">
        <div className="lf-updated">
          <span className="lf-upd-label">Last Updated</span>
          <span className="lf-upd-time">
            {updated ? new Date(updated).toLocaleTimeString() : "—"}
          </span>
        </div>

        <div className="lf-title-wrap">
          <span className="lf-dot" aria-hidden />
          <span className="lf-title">GCDC Live Feed</span>
        </div>

        <div className="lf-tabs" role="tablist" aria-label="Feed toggles">
          {titles.map((t, i) => (
            <button
              key={`tab-${i}`}
              role="tab"
              aria-selected={idx === i}
              className={`lf-tab ${idx === i ? "lf-tab--active" : ""}`}
              onClick={() => setIdx(i)}
              title={t}
            >
              {t || `Feed ${i + 1}`}
            </button>
          ))}
        </div>
      </div>

      {/* Scrolling body */}
      <div className="lf-body" style={{ ["--lf-speed" as any]: "24000ms" }}>
        <div className="lf-track">
          {items.map((t, i) => (
            <span key={`a-${i}`} className="lf-chip">{t}</span>
          ))}
          <span className="lf-gap" />
          {items.map((t, i) => (
            <span key={`b-${i}`} className="lf-chip">{t}</span>
          ))}
        </div>
        <div className="lf-track lf-track--alt">
          {items.map((t, i) => (
            <span key={`c-${i}`} className="lf-chip">{t}</span>
          ))}
          <span className="lf-gap" />
          {items.map((t, i) => (
            <span key={`d-${i}`} className="lf-chip">{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveFeedPanel;