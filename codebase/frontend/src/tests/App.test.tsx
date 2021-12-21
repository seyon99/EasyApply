import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";

test("Renders Welcome screen (while not signed in).", () => {
  render(<App />);
  const linkElement = screen.getByText(/Welcome. Please sign in./i);
  expect(linkElement).toBeInTheDocument();
});
