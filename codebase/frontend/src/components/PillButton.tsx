import React from "react";
import { useHistory } from "react-router-dom";

type PillButtonProps = {
  children: any;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  externalHref?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
  className?: string;
  disabled?: boolean;
};

const PillButton = ({
  children,
  href,
  externalHref = false,
  onClick,
  type = "button",
  className = "bg-blue-500",
  disabled = false,
}: PillButtonProps) => {
  // If href is provided, use it to navigate to the new page
  const history = useHistory();
  if (href) {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      // If externalHref is true, navigate to the new page using window.location.href. Otherwise, use history.push for internal navigation.
      if (!externalHref) {
        history.push(href || "");
      } else {
        window.location.href = href || "";
      }
    };

    return (
      <button
        onClick={handleClick}
        className={`${className} py-2 px-4 w-full md:w-auto rounded-md text-white rounded-full text-center`}
        type={type}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }

  // Register onClick handler if available
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${className} cursor-pointer py-2 px-4 w-full md:w-auto rounded-md text-white rounded-full text-center`}
        type={type}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }

  // No onClick or href, so just a button
  return (
    <button
      className={`${className} cursor-pointer py-2 px-4 w-full md:w-auto rounded-md text-white rounded-full text-center`}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default PillButton;
