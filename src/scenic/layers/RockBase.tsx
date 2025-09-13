import React from "react";

const RockBase: React.FC = () => (
  <div
    aria-hidden
    style={{
      position: "absolute",
      left: 12,
      bottom: 16,
      width: 110,
      height: 26,
      background: "#23384f",
      borderRadius: 16,
      opacity: 0.9,
    }}
  />
);

export default RockBase;