import { ArrowRightToLine, Moon, Sun } from "lucide-react";
import ControlFrame from "./ControlFrame";
import { IStory } from "../Stories";
import { Config } from "../Config";
import { useRecoilState } from "recoil";
import { leftHandModeState } from "../State";

interface ControlPanelProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  focusedStoryIndex: number;
  filteredStories: IStory[];
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  darkMode,
  setDarkMode,
  focusedStoryIndex,
  filteredStories,
}) => {
  const [leftHandMode, setLeftHandMode] = useRecoilState(leftHandModeState);
  const AnimationTiming = {
    handSwitch: 300,
    flipHandModeIcon: 350,
    moreStoriesOpacity: 200,
  };

  return (
    <>
      <div className="flex flex-row">
        <div
          className="ease-in-out"
          style={{
            flexGrow: leftHandMode ? 0 : 1,
            transitionDuration: `${AnimationTiming.handSwitch}ms`,
          }}
        />
        <div className="flex flex-col md:flex-row min-w-fit px-2 md:px-5 z-[1]">
          <ControlFrame
            className="p-1 w-fit cursor-pointer mb-2 md:mr-2 md:mb-0"
            onClick={() => setLeftHandMode((current) => !current)}
          >
            <ArrowRightToLine
              height={20}
              width={20}
              strokeWidth={1}
              className="transition-transform"
              style={{
                transitionDuration: `${AnimationTiming.flipHandModeIcon}ms`,
              }}
              transform={leftHandMode ? "scale(1, 1)" : "scale(-1, 1)"}
            />
          </ControlFrame>
          <ControlFrame
            className="p-1 w-fit cursor-pointer"
            onClick={() => setDarkMode((current) => !current)}
          >
            {darkMode ? (
              <Moon height={20} width={20} strokeWidth={1} />
            ) : (
              <Sun height={20} width={20} strokeWidth={1} />
            )}
          </ControlFrame>
        </div>
      </div>
      <div className="flex justify-between pb-5 pt-3 items-center px-3 md:px-5 relative z-[1]">
        <div className="flex font-mono select-none items-end text-sm md:text-lg">
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
            className="z-[2] text-black text-opacity-65 self-center justify-self-center
          dark:text-white dark:text-opacity-50 transition-colors text-lg md:text-2xl"
            style={{
              transitionDuration: `${Config.darkModeSwitchDuration}ms`,
            }}
          >
            More Stories Coming Soon
          </div>
        </div>
        <div className="flex font-barcode text-md md:text-2xl select-none justify-end items-end">
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
    </>
  );
};

export default ControlPanel;
