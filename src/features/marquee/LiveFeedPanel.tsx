import React, { useEffect, useMemo, useState } from "react";
import { useFeed, useLastUpdated } from "../../app/selectors";

const SPLIT_REGEX = /-{3,}|—{2,}|–{2,}/g;

const LiveFeedPanel: React.FC = () => {
  const feed = useFeed();
  const updated = useLastUpdated();

  const [idx, setIdx] = useState<number>(() => {
    const saved = Number(localStorage.getItem("liveFeedTab") ?? "0");
    return Number.isFinite(saved) ? saved : 0;
  });
  useEffect(() => localStorage.setItem("liveFeedTab", String(idx)), [idx]);

  // A15–A17 (tab labels)
  const titles = feed?.titles ?? ["Social", "Reviews", "Bank"];

  // B15–B17 (text for current tab) -> parts -> joined with separators
  const raw = (feed?.texts?.[idx] ?? "").trim();
  const parts = useMemo(() => {
    if (!raw) return [];
    return raw
      .split(SPLIT_REGEX)
      .map((s) => s.replace(/\s+/g, " ").trim())
      .filter(Boolean);
  }, [raw]);

  const line = parts.join(" • ");
  const lastTime = updated ? new Date(updated).toLocaleTimeString() : "—";

  // Optional stats (will show after Step 2)
  const mentions = (feed as any)?.stats?.mentions as number | undefined;
  const newReviews = (feed as any)?.stats?.newReviews as number | undefined;
  const impressions = (feed as any)?.stats?.impressions as number | undefined;

  return (
    <section className="lf card" role="region" aria-label="GCDC Live Feed">
      {/* Title + last updated */}
      <div className="lf-titlebar">
        <div className="lf-title-left">
          <span className="lf-title-main">GCDC Live Feed</span>
          <span className="lf-dot" aria-hidden />
          <span className="lf-upd-label">Last Updated</span>
          <span className="lf-upd-time">{lastTime}</span>
        </div>
        <div className="lf-badge" aria-hidden>
          <div className="lf-badge__medal" />
        </div>
      </div>

      {/* Tabs (A15–A17) */}
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

      {/* Seamless scrolling rail */}
      <div className="lf-rail">
        <div className="lf-track">
          <span className="lf-pill">{line}</span>
          <span className="lf-gap" />
          <span className="lf-pill">{line}</span>
        </div>
        <div className="lf-track lf-track--alt">
          <span className="lf-pill">{line}</span>
          <span className="lf-gap" />
          <span className="lf-pill">{line}</span>
        </div>
      </div>

      {/* Stats chips (show when values exist) */}
      <div className="lf-stats">
        {Number.isFinite(mentions as number) && (
          <span className="lf-chip">
            <span className="dot ok" /> Mentions: {mentions}
          </span>
        )}
        {Number.isFinite(newReviews as number) && (
          <span className="lf-chip">
            <span className="dot ok" /> New Reviews: {newReviews}
          </span>
        )}
        {Number.isFinite(impressions as number) && (
          <span className="lf-chip">
            <span className="dot ok" /> Impressions: {impressions}
          </span>
        )}
      </div>
    </section>
  );
};

export default LiveFeedPanel;