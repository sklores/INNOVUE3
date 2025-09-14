import React from "react";

/**
 * SafeArea — simple padded wrapper so content doesn’t hug the edges.
 * Default export (required by your App.tsx import).
 */
const SafeArea: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ padding: "16px", maxWidth: 1280, margin: "0 auto" }}>
      {children}
    </div>
  );
};

export default SafeArea;