import React from "react";

// Interface: AlertMessageProps
// Description: Interface for AlertMessage component
// AlertMessage parameters:
//  message: string
//  type: AlertType
type AlertMessageProps = {
  message: string;
  type?: String;
};

// Alert Message Type
const AlertType = {
  success: "bg-green-300",
  error: "bg-red-300",
  info: "bg-blue-300",
  warning: "bg-yellow-300",
};

// Alert Message Component
const AlertMessage = ({
  message,
  type = AlertType.info,
}: AlertMessageProps) => {
  return (
    <div
      className={`${
        // Hide alert message if message is empty
        !message ? "hidden" : "visible"
      } py-3 px-4 ${type} mb-4 rounded-md transition-all ease-in-out duration-1000 delay-100`}
    >
      {message}
    </div>
  );
};

export { AlertMessage, AlertType };
