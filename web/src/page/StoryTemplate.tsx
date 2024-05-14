import { ChevronDown, ChevronUp, Gauge, Mouse, Volume2 } from "lucide-react";
import Button from "../component/Button";
import { useState } from "react";
import * as Slider from "@radix-ui/react-slider";

export default function StoryTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mainVolume, setMainVolume] = useState(50);
  return (
    <>
      <div className="absolute left-[40px] bottom-[40px] flex flex-col">
        <div className="showChild">
          <div className="flex mb-[10px]">
            <div className="flex p-[7.5px] bg-black bg-opacity-25 rounded-full items-center justify-center border-2 border-white border-opacity-50 hover:bg-opacity-50 text-offWhite">
              <Button className="" onClick={() => {}}>
                <Mouse />
              </Button>
              <div className="child mx-2">Autoscroll</div>
            </div>
            <div className="child flex ml-2 p-[7.5px] bg-black bg-opacity-25 rounded-full items-center justify-center border-2 border-white border-opacity-50 text-offWhite">
              <Gauge />
              {/* Todo: Use javascript to make it users can't increase past 3 digits */}
              <span
                role="textbox"
                contentEditable
                className=" mx-2 bg-black bg-opacity-25 border-none outline-none text-white rounded px-1 min-w-[25px]"
              />
              <span>wpm</span>
              <div className="flex flex-col mx-2">
                <Button onClick={() => {}}>
                  <ChevronUp width={12} height={12} />
                </Button>
                <Button onClick={() => {}}>
                  <ChevronDown width={12} height={12} />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="flex p-[7.5px] bg-black bg-opacity-25 rounded-full items-center justify-center border-2 border-white border-opacity-50 hover:bg-opacity-50 text-offWhite">
              <Button className="" onClick={() => {}}>
                <Volume2 />
              </Button>
            </div>
            <div className="child ml-2 flex  p-[7.5px] bg-black bg-opacity-25 rounded-full items-center justify-center border-2 border-white border-opacity-50 text-offWhite w-full">
              <Slider.Root
                className="relative flex w-full touch-none select-none items-center"
                orientation="horizontal"
                defaultValue={[mainVolume]}
                max={100}
              >
                <Slider.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-black bg-opacity-25 border-offWhite">
                  <Slider.Range className="absolute h-full bg-[#1c2125]" />
                </Slider.Track>
                <Slider.Thumb className="block h-5 w-5 rounded-full border-2 border-offWhite bg-[#1c2125] ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
              </Slider.Root>

              <span
                role="textbox"
                contentEditable
                className="shrink-0 ml-2 mr-1 bg-black bg-opacity-25 border-none outline-none text-white rounded px-1 min-w-[25px]"
              >
                {mainVolume}
              </span>
              <span className="mr-2">%</span>
            </div>
          </div>
        </div>
      </div>

      {children}
    </>
  );
}
