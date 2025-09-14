import React, { useEffect, useMemo, useState } from "react";
import { useFeed, useLastUpdated } from "../../app/selectors";

/**
 * Splits a single B15–B17 feed text into parts on dashes like:
 * "Item A ---- Item B — Item C" -> ["Item A", "Item B", "Item C"]
 */
const SPLIT_REGEX = /-{3,}|—{2,}|–{2,}/g;

const LiveFeedPanel: React.FC = () => {
  const feed = useFeed();
  const updated = useLastUpdated(); // used only for display near the title

  // remember selected tab (A15/A16/A17) locally
  const [idx, setIdx] = useState<number>(() => {
    const saved = Number(localStorage.getItem("liveFeedTab") ?? "0");
    return Number.isFinite(saved) ? saved : 0;
  });
  useEffect(() => {
    localStorage.setItem("liveFeedTab", String(idx));
  }, [idx]);

  // Titles from A15–A17
  const titles = feed?.titles ?? ["Social", "Reviews", "Bank"];

  // Current text (from B15–B17) -> single line (joined with •)
  const raw = (feed?.texts?.[idx] ?? "").trim();
  const line = useMemo(() => {
    if (!raw) return "";
    const parts = raw
      .split(SPLIT_REGEX)
      .map((s) => s.replace(/\s+/g, " ").trim())
      .filter(Boolean);
    return parts.join(" • ");
  }, [raw]);

  // Optional stats if your state provides them (chips are hidden when undefined)
  const mentions = (feed as any)?.stats?.mentions as number | undefined;
  const newReviews = (feed as any)?.stats?.newReviews as number | undefined;
  const impressions = (feed as any)?.stats?.impressions as number | undefined;

  const lastTime = updated ? new Date(updated).toLocaleTimeString() : "—";

  return (
    <section className="lf card" role="region" aria-label="GCDC Live Feed">
      {/* Title row */}
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

      {/* Tall blue rail — single static line (no scroll) */}
      <div className="lf-rail">
        <div className="lf-line" title={line}>
          {line || "No items yet"}
        </div>
      </div>

      {/* Stats chips (render only when values exist) */}
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