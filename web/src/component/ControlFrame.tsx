import React from "react";
import { cn } from "../helper/cn";

interface ControlFrameProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  children: JSX.Element;
}

const ControlFrame: React.FC<ControlFrameProps> = ({
  children,
  className,
  ...props
}) => {
  const classNames = cn(
    className,
    "flex bg-black bg-opacity-25 dark:bg-white dark:bg-opacity-25 rounded-full items-center justify-center border-2 border-white border-opacity-50 hover:bg-opacity-[0.4] dark:hover:bg-opacity-[0.4]"
  );
  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  );
};

export default ControlFrame;
