import React from "react";
import "tailwindcss/tailwind.css";
import { useLocation, Redirect } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// useQuery hook to parse query string
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SignInCallback = () => {
  const auth = useAuth();

  // Parse token from query string
  const d = useQuery().get("d") || btoa(JSON.stringify({}));

  // Decode Base64 token
  const callbackDataJsonString = atob(d);

  // Parse JSON
  const callbackData = JSON.parse(callbackDataJsonString);

  const authToken: string = callbackData.token || "";
  const authData: string = JSON.stringify(callbackData.authData) || "";

  // Set token and authData in auth context
  auth.updateData({ authToken, authData });

  // Redirect to home
  return <Redirect to="/" />;
};

export default SignInCallback;
