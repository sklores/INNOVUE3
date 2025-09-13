import React from "react";
import { LOGO } from "../../tuning";

const BrandSplash: React.FC = () => (
  <div
    aria-label="Client Logo"
    style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        width: LOGO.SIZE,
        height: LOGO.SIZE,
        borderRadius: "50%",
        background: "linear-gradient(180deg, #ffefb0 0%, #ffd767 100%)",
        boxShadow: "0 12px 22px rgba(0,0,0,0.18), inset 0 0 0 4px #f2cf5c",
        display: "grid",
        placeItems: "center",
        fontWeight: 900,
        color: "#5a4400",
      }}
    >
      LOGO
    </div>
  </div>
);

export default BrandSplash;