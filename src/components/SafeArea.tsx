import React from "react";

const SafeArea: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ padding: "16px", maxWidth: 1280, margin: "0 auto" }}>
      {children}
    </div>
  );
};

export default SafeArea;