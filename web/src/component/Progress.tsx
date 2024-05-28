import React from "react";

interface ProgressProps {
  current: number;
  max: number;
}

const Progress: React.FC<ProgressProps> = ({ current, max }) => {
  const progressPercentage = (current / max) * 100 * (70 / 30);

  return (
    <div className="w-2 h-20 bg-black bg-opacity-25 rounded-full flex items-start">
      <div
        className="w-full h-[30%] bg-black rounded-full"
        style={{ transform: `translateY(${progressPercentage}%)` }}
      />
    </div>
  );
};

export default Progress;
