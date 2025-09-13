import React, { useState } from "react";
import { SegmentedControl } from "./SegmentedControl";
import { refreshNow, useAppDispatch } from "../app/state";

export const ControlPill: React.FC = () => {
  const dispatch = useAppDispatch();
  const [busy, setBusy] = useState(false);

  const doRefresh = async () => {
    if (busy) return;
    setBusy(true);
    await refreshNow(dispatch);
    setBusy(false);
  };

  return (
    <div className="pill">
      <SegmentedControl />
      <div className="pill-gap" />
      <button className="pill-refresh" onClick={doRefresh} disabled={busy} aria-label="Refresh">
        {busy ? "…" : "Refresh"}
      </button>
    </div>
  );
};