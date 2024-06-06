import React from "react";

interface ProgressProps {
  current: number;
  max: number;
  transitionDuration?: number;
}

const Progress: React.FC<ProgressProps> = ({
  current,
  max,
  transitionDuration = 300,
}) => {
  let heightPercentage = 0;
  let progressPercentage = 100;

  if (max !== 0) {
    heightPercentage = Math.max(100 / (max + 1), 30);
    progressPercentage =
      (current / max) * 100 * ((100 - heightPercentage) / heightPercentage);
  }

  return (
    <div
      className="w-2 h-20 bg-black dark:bg-white dark:bg-opacity-25 bg-opacity-25
    rounded-full flex items-start transition-colors"
      style={{
        transitionDuration: `${transitionDuration}ms`,
      }}
    >
      <div
        className="w-full transition-transform duration-300 ease-in-out"
        style={{
          transform: `translateY(${progressPercentage}%)`,
          height: `${heightPercentage}%`,
        }}
      >
        <div
          className="w-full h-full bg-black rounded-full dark:bg-white transition-colors"
          style={{
            transitionDuration: `${transitionDuration}ms`,
          }}
        />
      </div>
    </div>
  );
};

export default Progress;
