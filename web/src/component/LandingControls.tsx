import React from "react";
import { ArrowRightToLine, Moon, Sun } from "lucide-react";
import ControlFrame from "./ControlFrame";
import { IStory } from "../Stories";
import { Config } from "../Config";

interface ControlPanelProps {
  leftHandMode: boolean;
  setLeftHandMode: React.Dispatch<React.SetStateAction<boolean>>;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  AnimationTiming: { [key: string]: number };
  focusedStoryIndex: number;
  filteredStories: IStory[];
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  leftHandMode,
  setLeftHandMode,
  darkMode,
  setDarkMode,
  AnimationTiming,
  focusedStoryIndex,
  filteredStories,
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
        <ArrowRightToLine
          height={20}
          width={20}
          strokeWidth={1}
          className="transition-transform"
          style={{
            transitionDuration: `${AnimationTiming.flipLeftHandModeIcon}ms`,
          }}
          transform={leftHandMode ? "scale(1, 1)" : "scale(-1, 1)"}
        />
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
      <div className="flex-1 flex font-mono select-none items-end">
        FRV-1 07May2024
      </div>
      <div
        className="flex-1 flex justify-center transition-[opacity]"
        style={{
          transitionDuration: `${AnimationTiming.moreStoriesOpacity}ms`,
          opacity:
            focusedStoryIndex === Math.max(filteredStories.length - 1, 0)
              ? 1
              : 0,
        }}
      >
        <div
          className="z-[2] text-black text-opacity-65 dark:text-white dark:text-opacity-50 text-2xl transition-colors"
          style={{
            transitionDuration: `${Config.darkModeSwitchDuration}ms`,
          }}
        >
          More Stories Coming Soon
        </div>
      </div>
      <div className="flex-1 flex font-barcode text-2xl select-none justify-end items-end">
        {/* Fix number value when stories are filtered */}
        {filteredStories.length === 0
          ? "undefined"
          : `No${"0".repeat(
              filteredStories.length.toString().length -
                focusedStoryIndex.toString().length
            )}${focusedStoryIndex} ${
              filteredStories[focusedStoryIndex].datePublished
            }`}
      </div>
    </div>
  </div>
);

export default ControlPanel;
