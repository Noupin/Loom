import React from "react";
import { Config } from "../Config";
import { IProgressProps } from "../types/IProgressProps";

export const Progress: React.FC<IProgressProps> = ({
  current,
  max,
  scaleHeightBy,
  minSegment = 30,
}) => {
  const maxIndex = max - 1;
  let heightPercentage = 0;
  let progressPercentage = 100;

  if (maxIndex !== 0) {
    heightPercentage = Math.max(
      100 / max / (scaleHeightBy || 1),
      minSegment / (scaleHeightBy || 1)
    );
    progressPercentage =
      (current / maxIndex) *
      100 *
      ((100 - heightPercentage) / heightPercentage);
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <p
        className="mb-2 text-center"
        style={{
          width: `${(max + 1).toString().length + 1}ch`,
        }}
      >
        <sup>{max ? current + 1 : 0}</sup>&frasl;<sub>{max ? max : 0}</sub>
      </p>
      <div
        className="w-2 bg-black dark:bg-white dark:bg-opacity-25 bg-opacity-25 backdrop-blur-sm
    rounded-full flex items-start transition-colors"
        style={{
          height: `${Math.floor((scaleHeightBy || 1) * 5)}rem`,
          transitionDuration: `${Config.darkModeSwitchDuration}ms`,
        }}
      >
        <div
          className="w-full transition-transform ease-in-out"
          style={{
            transform: `translateY(${progressPercentage}%)`,
            height: `${heightPercentage}%`,
            transitionDuration: `${Config.progressMovementDuration}ms`,
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
    </div>
  );
};
