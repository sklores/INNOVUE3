import React from "react";
import { useAppDispatch } from "../app/state";
import { useViewRange } from "../app/selectors";

export const SegmentedControl: React.FC = () => {
  const dispatch = useAppDispatch();
  const current = useViewRange();

  const btn = (key: "day" | "week" | "month", label: string) => (
    <button
      key={key}
      className={`seg-btn ${current === key ? "seg-active" : ""}`}
      onClick={() => dispatch({ type: "setRange", payload: key })}
      aria-pressed={current === key}
    >
      {label}
    </button>
  );

  return (
    <div className="seg-wrap" role="tablist" aria-label="Range">
      {btn("day", "Day")}
      {btn("week", "Week")}
      {btn("month", "Month")}
    </div>
  );
};