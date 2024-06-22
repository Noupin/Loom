import React from "react";
import { Config } from "../Config";

interface ProgressProps {
  current: number;
  max: number;
  transitionDuration?: number;
  scaleHeightBy?: number;
}

export const Progress: React.FC<ProgressProps> = ({
  current,
  max,
  scaleHeightBy,
}) => {
  let heightPercentage = 0;
  let progressPercentage = 100;

  if (max !== 0) {
    heightPercentage = Math.max(
      100 / (max + 1) / (scaleHeightBy || 1),
      30 / (scaleHeightBy || 1)
    );
    progressPercentage =
      (current / max) * 100 * ((100 - heightPercentage) / heightPercentage);
  }

  return (
    <div
      className="w-2 bg-black dark:bg-white dark:bg-opacity-25 bg-opacity-25 backdrop-blur-sm
    rounded-full flex items-start transition-colors"
      style={{
        height: `${Math.floor((scaleHeightBy || 1) * 5)}rem`,
        transitionDuration: `${Config.darkModeSwitchDuration}ms`,
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
            transitionDuration: `${Config.darkModeSwitchDuration}ms`,
          }}
        />
      </div>
    </div>
  );
};
