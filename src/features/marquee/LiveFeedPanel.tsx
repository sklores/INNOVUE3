// Innovue 3 — Marquee (M1 visuals only)
// Title + Last Updated, centered tabs (A15–A17), tall blue rail with smooth scroll
// Reads live text from B15–B17 via useFeed(); chips render only if feed.stats exists.
// NO data-layer edits here.

import React, { useEffect, useMemo, useState } from "react";
import { useFeed, useLastUpdated } from "../../app/selectors";

// Split on sequences of dashes (-----) and longer em/en dashes (—— / ––)
const SPLIT_REGEX = /-{3,}|—{2,}|–{2,}/g;

type Stat = { label: string; value: number };

const LiveFeedPanel: React.FC = () => {
  const feed = useFeed();                  // { titles: string[], texts: string[], stats?: {...} }
  const updated = useLastUpdated();        // number | null (epoch ms)

  // Remember the selected tab locally
  const [idx, setIdx] = useState<number>(() => {
    const saved = Number(localStorage.getItem("liveFeedTab") ?? "0");
    return Number.isFinite(saved) ? saved : 0;
  });
  useEffect(() => localStorage.setItem("liveFeedTab", String(idx)), [idx]);

  // Tab labels from A15–A17
  const titles = feed?.titles ?? ["Social", "Reviews", "Bank"];

  // Current tab’s text from B15–B17 -> split -> join with •
  const raw = (feed?.texts?.[idx] ?? "").trim();
  const parts = useMemo(() => {
    if (!raw) return [];
    return raw
      .split(SPLIT_REGEX)
      .map((s) => s.replace(/\s+/g, " ").trim())
      .filter(Boolean);
  }, [raw]);

  const line = parts.join(" • ");

  // Optional stats (only display if provided by state already)
  const stats: Stat[] = useMemo(() => {
    const s: any = (feed as any)?.stats || {};
    const out: Stat[] = [];
    if (s.mentions != null) out.push({ label: "Mentions", value: Number(s.mentions) });
    if (s.newReviews != null) out.push({ label: "New Reviews", value: Number(s.newReviews) });
    if (s.impressions != null) out.push({ label: "Impressions", value: Number(s.impressions) });
    return out;
  }, [feed]);

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

      {/* Centered pill tabs */}
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

      {/* Tall blue rail — seamless dual-track scroll */}
      <div className="lf-rail">
        <div className="lf-track">
          <span className="lf-pill">{line || "No items yet"}</span>
          <span className="lf-gap" />
          <span className="lf-pill">{line || "No items yet"}</span>
        </div>
        <div className="lf-track lf-track--alt">
          <span className="lf-pill">{line || "No items yet"}</span>
          <span className="lf-gap" />
          <span className="lf-pill">{line || "No items yet"}</span>
        </div>
      </div>

      {/* Chips (render only if values exist) */}
      {stats.length > 0 && (
        <div className="lf-stats">
          {stats.map((s, i) => (
            <span key={i} className="lf-chip">
              <span className="dot ok" />
              {s.label}: {s.value}
            </span>
          ))}
        </div>
      )}
    </section>
  );
};

export default LiveFeedPanel;