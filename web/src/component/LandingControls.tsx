import React from "react";
import { ArrowRightToLine, ArrowLeftToLine, Moon, Sun } from "lucide-react";
import ControlFrame from "./ControlFrame";
import { STORIES } from "../Stories";

interface ControlPanelProps {
  leftHandMode: boolean;
  setLeftHandMode: React.Dispatch<React.SetStateAction<boolean>>;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  AnimationTiming: { [key: string]: number };
  focusedStoryIndex: number;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  leftHandMode,
  setLeftHandMode,
  darkMode,
  setDarkMode,
  AnimationTiming,
  focusedStoryIndex,
}) => (
  <div className="flex flex-col relative z-1">
    <div
      className="flex px-5 transition-[width] ease-in-out justify-end min-w-fit"
      style={{
        width: leftHandMode ? "0%" : "100%",
        transitionDuration: `${AnimationTiming.leftHandSwitch}ms`,
      }}
    >
      <ControlFrame
        className="p-1 w-fit cursor-pointer mr-2"
        onClick={() => setLeftHandMode((current) => !current)}
      >
        {leftHandMode ? (
          <ArrowRightToLine height={20} width={20} strokeWidth={1} />
        ) : (
          <ArrowLeftToLine height={20} width={20} strokeWidth={1} />
        )}
      </ControlFrame>
      <ControlFrame
        className="p-1 w-fit cursor-pointer ml-2"
        onClick={() => setDarkMode((current) => !current)}
      >
        {darkMode ? (
          <Moon height={20} width={20} strokeWidth={1} />
        ) : (
          <Sun height={20} width={20} strokeWidth={1} />
        )}
      </ControlFrame>
    </div>
    <div className="flex justify-between px-5 pb-5 pt-3">
      <div className="flex font-mono select-none items-end">
        FRV-1 07May2024
      </div>
      <div className="flex font-barcode text-2xl select-none">
        No
        {"0".repeat(
          STORIES.length.toString().length - focusedStoryIndex.toString().length
        )}
        {focusedStoryIndex} {STORIES[focusedStoryIndex].datePublished}
      </div>
    </div>
  </div>
);

export default ControlPanel;
