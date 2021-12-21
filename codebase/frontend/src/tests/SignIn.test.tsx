import React from "react";
import { render, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import SignIn from "../pages/SignIn";
import App from "../App";

test("Renders Sign In screen (while not signed in).", () => {
  render(<App />);
  screen.getByText("Sign in").click();

  const linkElement = screen.getByText(/Sign in to your account/i);
  expect(linkElement).toBeInTheDocument();

  const emailInput = screen.getByRole("email");
  expect(emailInput).toHaveProperty("placeholder", "my@email.net");

  const passwordInput = screen.getByRole("password");
  expect(passwordInput).toBeInTheDocument();
});
