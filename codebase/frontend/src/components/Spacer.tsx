import React from "react";

type SpacerProps = {
  height: number;
};

// Spacer component to add space between components
export const Spacer = ({ height }: SpacerProps) => (
  <div style={{ height: `${height}rem` }} />
);
