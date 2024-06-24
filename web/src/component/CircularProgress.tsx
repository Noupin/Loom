import React from "react";
import { Config } from "../Config";
import { IProgressProps } from "../types/IProgressProps";

interface CircularProgressProps extends IProgressProps {
  radius?: number;
  stroke?: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  current,
  max,
  radius = 15,
  stroke = 2,
  minSegment = 30,
}) => {
  const maxIndex = max - 1;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = maxIndex ? (current / maxIndex) * 100 : 0;
  const segmentSize = Math.max(360 / max, minSegment);
  const rotation = (progress / 100) * (360 - segmentSize);

  return (
    <div className="flex flex-col justify-center items-center">
      <p
        className="mb-1 text-center"
        style={{
          width: `${(max + 1).toString().length + 1}ch`,
        }}
      >
        <sup>{max ? current + 1 : 0}</sup>&frasl;<sub>{max ? max : 0}</sub>
      </p>

      <svg height={radius * 2} width={radius * 2}>
        <g transform={`rotate(-90 ${radius} ${radius})`}>
          <circle
            className="stroke-black dark:stroke-white dark:stroke-opacity-25 stroke-opacity-25"
            fill="transparent"
            strokeWidth={stroke}
            strokeOpacity={0.25}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {max > 1 && (
            <circle
              className="stroke-black dark:stroke-white"
              fill="transparent"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${
                circumference * (segmentSize / 360)
              } ${circumference}`}
              style={{
                transformOrigin: "center",
                transform: `rotate(${rotation}deg)`,
                transition: `stroke-dashoffset ${Config.progressMovementDuration}ms ease-in-out, transform ${Config.progressMovementDuration}ms ease-in-out`,
              }}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          )}
          )
        </g>
      </svg>
    </div>
  );
};
