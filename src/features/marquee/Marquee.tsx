// src/features/marquee/Marquee.tsx
import React, { useMemo, useState } from "react";
import { useFeed } from "../../app/selectors";

/**
 * GCDC Live Feed Marquee
 * - Toggle buttons = A15/A16/A17
 * - Content = B15/B16/B17 (split by "-----")
 */
const SPLIT_REGEX = /-{3,}|—{2,}|–{2,}/g; // handles "-----" and long dashes

const Marquee: React.FC = () => {
  const feed = useFeed();
  const [idx, setIdx] = useState(0);

  const titles = feed?.titles ?? ["Feed A", "Feed B", "Feed C"];
  const text = (feed?.texts?.[idx] ?? "").trim();

  const items = useMemo(() => {
    if (!text) return [];
    return text
      .split(SPLIT_REGEX)
      .map(s => s.trim())
      .filter(Boolean);
  }, [text]);

  return (
    <section className="mq card" aria-label="GCDC Live Feed">
      {/* Header with title and toggle buttons */}
      <div className="mq-header">
        <span className="mq-dot" aria-hidden />
        <span className="mq-title">GCDC Live Feed</span>
        <div className="mq-toggles" role="tablist" aria-label="Feed toggles">
          {titles.map((t, i) => (
            <button
              key={`t-${i}`}
              role="tab"
              aria-selected={idx === i}
              className={`mq-toggle ${idx === i ? "mq-toggle--active" : ""}`}
              onClick={() => setIdx(i)}
              title={t}
            >
              {t || `Feed ${i + 1}`}
            </button>
          ))}
        </div>
      </div>

      {/* Scrolling content */}
      <div className="mq-viewport" style={{ ["--mq-speed" as any]: "22000ms" }}>
        <div className="mq-track">
          {items.map((t, i) => <span key={`a-${i}`} className="mq-chip">{t}</span>)}
          <span className="mq-gap" />
          {items.map((t, i) => <span key={`b-${i}`} className="mq-chip">{t}</span>)}
        </div>
        <div className="mq-track mq-track--alt">
          {items.map((t, i) => <span key={`c-${i}`} className="mq-chip">{t}</span>)}
          <span className="mq-gap" />
          {items.map((t, i) => <span key={`d-${i}`} className="mq-chip">{t}</span>)}
        </div>
      </div>
    </section>
  );
};

export default Marquee;