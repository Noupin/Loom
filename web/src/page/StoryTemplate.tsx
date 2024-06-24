import {
  ArrowRightToLine,
  ChevronDown,
  ChevronUp,
  ChevronsUp,
  Gauge,
  Moon,
  Mouse,
  MouseOff,
  Sun,
  Volume2,
} from "lucide-react";
import Button from "../component/Button";
import { useEffect, useRef, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { useRecoilState } from "recoil";
import {
  autoScrollState,
  darkModeState,
  leftHandModeState,
  wpmState,
} from "../State";
import { Config } from "../Config";
import ControlFrame from "../component/ControlFrame";

interface IStoryTemplate {
  children: React.ReactNode;
  allowDarkMode?: boolean;
  useLightColorControls?: boolean;
}

const StoryTemplate: React.FC<IStoryTemplate> = ({
  children,
  allowDarkMode = false,
  useLightColorControls = false,
}) => {
  // Component state
  const [mainVolume, setMainVolume] = useState(50);
  const [wpm, setWpm] = useRecoilState(wpmState);
  const [leftHandMode, setLeftHandMode] = useRecoilState(leftHandModeState);
  const [darkMode, setDarkMode] = useRecoilState(darkModeState);
  const [autoScroll, setAutoScroll] = useRecoilState(autoScrollState);
  const [_, setMuteMain] = useState(false);
  const [showExpandedControls, setShowExpandedControls] = useState(false);
  const incomingDarkModeRef = useRef(darkMode);

  const AnimationTiming = {
    controlsGrow: 300,
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    // Parse the value to an integer
    const parsedValue = parseInt(value, 10);
    // Clamp the value between 0 and 100
    if (!isNaN(parsedValue)) {
      const clampedValue = Math.max(0, Math.min(100, parsedValue));
      setMainVolume(clampedValue);
      // Update the input field to reflect the clamped value, removing leading zeros
      event.target.value = clampedValue.toString();
    } else {
      // If the input is cleared, set volume to 0
      setMainVolume(0);
      event.target.value = "0";
    }
  };

  const handleWpmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    // Remove leading zeros, except when the value is 0
    if (value !== "0") {
      value = value.replace(/^0+/, "");
    }
    // Parse the value to an integer and clamp it between 0 and 999
    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue)) {
      const clampedValue = Math.max(0, Math.min(999, parsedValue));
      setWpm(clampedValue);
      // Update the input field to reflect the clamped value, removing leading zeros
      event.target.value = clampedValue.toString();
    } else {
      // If the input is cleared, set WPM to 0
      setWpm(0);
      event.target.value = "0";
    }
  };

  const incrementWpm = () => {
    setWpm((current) => Math.min(999, current + 1));
  };
  const decrementWpm = () => {
    setWpm((current) => Math.max(0, current - 1));
  };

  useEffect(() => {
    incomingDarkModeRef.current = darkMode;
  }, []);

  useEffect(() => {
    if (!allowDarkMode || !useLightColorControls) {
      setDarkMode(true);
    }

    if (useLightColorControls) {
      setDarkMode(true);
    }

    return () => {
      setDarkMode(incomingDarkModeRef.current);
    };
  }, [darkMode]);

  return (
    <>
      <div className="absolute bottom-[20px] w-full px-[20px] flex flex-row z-[1]">
        <div
          className="ease-in-out"
          style={{
            flexGrow: leftHandMode ? 0 : 1,
            transitionDuration: `${Config.leftHandModeSwitchDuration}ms`,
          }}
        />

        <div className="flex flex-col transition-[width] dark:text-off overflow-hidden">
          <div
            className="flex mb-[10px] transition-[opacity, width]"
            style={{
              opacity: showExpandedControls ? "100%" : "0%",
              width: showExpandedControls ? "100%" : "0px",
              transitionDuration: `${AnimationTiming.controlsGrow}ms`,
            }}
          >
            <Button
              onClick={() => {
                setAutoScroll((current) => !current);
              }}
            >
              <ControlFrame className="p-1 w-fit cursor-pointer">
                {autoScroll ? (
                  <Mouse height={20} width={20} strokeWidth={1} />
                ) : (
                  <MouseOff height={20} width={20} strokeWidth={1} />
                )}

                <div className="mx-2">Autoscroll</div>
              </ControlFrame>
            </Button>
            <ControlFrame className="p-1 ml-2 w-fit cursor-pointer">
              <Gauge height={20} width={20} strokeWidth={1} />
              <input
                type="number"
                value={wpm}
                min={0}
                max={999}
                onChange={handleWpmChange}
                className="box-border appearance-none mx-2 px-1 bg-black bg-opacity-25 border-none outline-none text-off-500 dark:text-off rounded min-w-[25px] max-w-[38px] text-center"
              />
              <span>wpm</span>
              <div className="flex flex-col mx-2">
                <Button onClick={incrementWpm}>
                  <ChevronUp width={12} height={12} />
                </Button>
                <Button onClick={decrementWpm}>
                  <ChevronDown width={12} height={12} />
                </Button>
              </div>
            </ControlFrame>
          </div>
          <div
            className="mb-[10px] hidden"
            // style={{ display: showExpandedControls ? "flex" : "none" }}
          >
            <ControlFrame className="p-1 w-fit cursor-pointer">
              <Button
                onClick={() => {
                  setMuteMain((current) => !current);
                }}
              >
                <Volume2 height={20} width={20} strokeWidth={1} />
              </Button>
            </ControlFrame>
            <ControlFrame className="p-1 ml-2 cursor-pointer w-full">
              <Slider.Root
                className="relative flex w-full touch-none select-none items-center"
                orientation="horizontal"
                value={[mainVolume]}
                onValueChange={(value) => setMainVolume(value[0])}
                max={100}
              >
                <Slider.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-black bg-opacity-25 border-off">
                  <Slider.Range className="absolute h-full bg-off-500 dark:bg-off" />
                </Slider.Track>
                <Slider.Thumb className="block h-5 w-5 rounded-full border-2 border-off dark:border-off-500 bg-off-500 dark:bg-off ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
              </Slider.Root>

              <input
                type="number"
                value={mainVolume}
                min={0}
                max={100}
                onChange={handleVolumeChange}
                className="box-border mx-2 bg-black bg-opacity-25 border-none outline-none text-off-500 dark:text-off rounded min-w-[25px] max-w-[38px] text-center"
              />
              <span className="mr-2">%</span>
            </ControlFrame>
          </div>
          <div
            className="flex w-full"
            style={{
              justifyContent: leftHandMode ? "flex-start" : "flex-end",
            }}
          >
            <ControlFrame
              className="flex p-1 cursor-pointer mr-2 transition-[flex-grow]"
              style={{
                flexGrow: showExpandedControls ? 1 : 0,
                transitionDuration: `${AnimationTiming.controlsGrow}ms`,
              }}
              onClick={() => setLeftHandMode((current) => !current)}
            >
              <ArrowRightToLine
                height={20}
                width={20}
                strokeWidth={1}
                className="transition-transform"
                style={{
                  transitionDuration: `${Config.lefHandIconFlipDuration}ms`,
                  transform: leftHandMode ? "scale(1, 1)" : "scale(-1, 1)",
                }}
              />
            </ControlFrame>
            <ControlFrame
              className="flex p-1 cursor-pointer transition-[flex-grow]"
              style={{
                flexGrow: showExpandedControls ? 1 : 0,
                transitionDuration: `${AnimationTiming.controlsGrow}ms`,
              }}
              onClick={() => setShowExpandedControls((current) => !current)}
            >
              <ChevronsUp
                height={20}
                width={20}
                strokeWidth={1}
                className="transition-transform"
                style={{
                  transitionDuration: `${Config.lefHandIconFlipDuration}ms`,
                  transform: showExpandedControls
                    ? "scale(1, -1)"
                    : "scale(1, 1)",
                }}
              />
            </ControlFrame>
            {allowDarkMode && (
              <ControlFrame
                className="flex p-1 cursor-pointer transition-[flex-grow]"
                style={{ flexGrow: showExpandedControls ? 1 : 0 }}
                onClick={() => setDarkMode((current) => !current)}
              >
                {darkMode ? (
                  <Moon height={20} width={20} strokeWidth={1} />
                ) : (
                  <Sun height={20} width={20} strokeWidth={1} />
                )}
              </ControlFrame>
            )}
          </div>
        </div>
      </div>

      {children}
    </>
  );
};

export default StoryTemplate;
