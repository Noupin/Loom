import React from "react";

interface ProgressProps {
  current: number;
  max: number;
}

const Progress: React.FC<ProgressProps> = ({ current, max }) => {
  const heightPercentage = Math.max(100 / (max + 1), 30);
  const progressPercentage =
    (current / max) * 100 * ((100 - heightPercentage) / heightPercentage);

  return (
    <div className="w-2 h-20 bg-black dark:bg-white dark:bg-opacity-25 bg-opacity-25 rounded-full flex items-start">
      <div
        className="w-full bg-black rounded-full dark:bg-white transition-transform duration-200 ease-in-out"
        style={{
          transform: `translateY(${progressPercentage}%)`,
          height: `${heightPercentage}%`,
        }}
      />
    </div>
  );
};

export default Progress;
