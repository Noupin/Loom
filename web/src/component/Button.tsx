import React from "react";

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  onClick: () => void;
  children: JSX.Element;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, ...props }) => {
  return (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default Button;
