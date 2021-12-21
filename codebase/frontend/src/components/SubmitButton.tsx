import React from "react";
import PillButton from "./PillButton";
import "../assets/SignIn.css";

type SubmitButtonProps = {
  children?: React.ReactNode;
  // Additional classes to be added to the button
  className?: string;

  // Button state
  state?: "default" | "success" | "pending";

  // Text to show on success
  successText?: string;

  // Text to show on pending
  pendingText?: string;

  // Text to show on default
  defaultText?: string;
};

const SubmitButton = ({
  className = "",
  state = "default",
  successText = "Signed in",
  pendingText = "Please wait",
  defaultText = "Continue",
}: SubmitButtonProps) => {
  const disabled = state === "pending" || state === "success";
  return (
    <PillButton
      className={`${className} ${
        disabled ? "button-disabled" : "cursor-pointer"
      } transition-all ease-in-out duration-500 ${
        state === "success" ? "bg-green-400" : "bg-blue-600 disabled:opacity-50"
      } py-2 h-10 w-10 object-scale-down px-6 rounded-md `}
      disabled={disabled}
      type="submit"
    >
      {state === "success" ? (
        <div className="flex flex-row text-center">
          <div className="mr-3">{successText}</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
          </svg>
        </div>
      ) : state === "pending" ? (
        <div className="flex flex-row text-center">
          <div className="mr-3">{pendingText}</div>
          <div
            style={{ borderTopColor: "transparent" }}
            className="w-4 h-4 mt-1 border-4 border-blue-400 border-solid rounded-full animate-spin"
          />
        </div>
      ) : (
        <div>{defaultText}</div>
      )}
    </PillButton>
  );
};

export default SubmitButton;
