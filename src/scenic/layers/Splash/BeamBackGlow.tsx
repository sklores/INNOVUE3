import React from "react";

const BeamBackGlow: React.FC = () => (
  <div
    aria-hidden
    style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
    }}
  >
    <div
      style={{
        width: 220,
        height: 220,
        borderRadius: "50%",
        background: "radial-gradient(ellipse at center, rgba(255,228,138,0.55), rgba(255,228,138,0) 65%)",
        filter: "blur(6px)",
      }}
    />
  </div>
);

export default BeamBackGlow;