import React from "react";

type TextInputProps = {
  name: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  value?: string;
  type?: string;
  required?: boolean;
  className?: string;
  role?: string;
  autoComplete?: string;
};

const TextInput = ({
  name,
  role = "textbox",
  onChange = (event: React.ChangeEvent<HTMLInputElement>) => {},
  placeholder = "",
  value,
  type = "text",
  required = false,
  autoComplete = "off",
  className = "focus:outline-none bg-gray-200 w-full py-2 px-4 focus:bg-gray-100 border-2 border-gray-200 rounded-full",
}: TextInputProps) => {
  return (
    <input
      role={role}
      type={type}
      name={name}
      className={className}
      required={required}
      placeholder={placeholder}
      value={value}
      autoComplete={autoComplete}
      onChange={onChange}
    />
  );
};

export default TextInput;
