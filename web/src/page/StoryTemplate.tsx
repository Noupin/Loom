import { ChevronDown, ChevronUp, Gauge, Mouse, Volume2 } from "lucide-react";
import Button from "../component/Button";
import { useState } from "react";
import * as Slider from "@radix-ui/react-slider";

export default function StoryTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  // Component state
  const [mainVolume, setMainVolume] = useState(50);
  const [wpm, setWpm] = useState(183);
  const [autoscroll, setAutoscroll] = useState(false);
  const [muteMain, setMuteMain] = useState(false);

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

  return (
    <>
      <div className="absolute left-[40px] bottom-[40px] flex flex-col">
        <div className="showChild">
          <div className="flex mb-[10px]">
            <div className="flex p-[7.5px] bg-black bg-opacity-25 rounded-full items-center justify-center border-2 border-white border-opacity-50 hover:bg-opacity-50 text-off">
              <Button className="" onClick={() => {}}>
                <Mouse />
              </Button>
              <div className="child mx-2">Autoscroll</div>
            </div>
            <div className="child flex ml-2 p-[7.5px] bg-black bg-opacity-25 rounded-full items-center justify-center border-2 border-white border-opacity-50 text-off">
              <Gauge />
              <input
                type="number"
                value={wpm}
                min={0}
                max={999}
                onChange={handleWpmChange}
                className="box-border appearance-none mx-2 px-1 bg-black bg-opacity-25 border-none outline-none text-white rounded min-w-[25px] max-w-[38px] text-center"
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
            </div>
          </div>
          <div className="flex">
            <div className="flex p-[7.5px] bg-black bg-opacity-25 rounded-full items-center justify-center border-2 border-white border-opacity-50 hover:bg-opacity-50 text-off">
              <Button className="" onClick={() => {}}>
                <Volume2 />
              </Button>
            </div>
            <div className="child ml-2 flex  p-[7.5px] bg-black bg-opacity-25 rounded-full items-center justify-center border-2 border-white border-opacity-50 text-off w-full">
              <Slider.Root
                className="relative flex w-full touch-none select-none items-center"
                orientation="horizontal"
                value={[mainVolume]}
                onValueChange={(value) => setMainVolume(value[0])}
                max={100}
              >
                <Slider.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-black bg-opacity-25 border-off">
                  <Slider.Range className="absolute h-full bg-[#1c2125]" />
                </Slider.Track>
                <Slider.Thumb className="block h-5 w-5 rounded-full border-2 border-off bg-[#1c2125] ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
              </Slider.Root>

              <input
                type="number"
                value={mainVolume}
                min={0}
                max={100}
                onChange={handleVolumeChange}
                className="box-border mx-2 bg-black bg-opacity-25 border-none outline-none text-white rounded min-w-[25px] max-w-[38px] text-center"
              />
              <span className="mr-2">%</span>
            </div>
          </div>
        </div>
      </div>

      {children}
    </>
  );
}
