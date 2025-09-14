import React from "react";

/**
 * Simple padded wrapper to keep content off the edges.
 * If you already had a SafeArea component, this replaces it with a minimal version.
 */
const SafeArea: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      style={{
        padding: "16px",
        maxWidth: 1280,
        margin: "0 auto",
      }}
    >
      {children}
    </div>
  );
};

export default SafeArea;