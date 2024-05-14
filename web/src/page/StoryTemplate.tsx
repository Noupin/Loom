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
            <div className="ml-2 flex  p-[7.5px] bg-black bg-opacity-25 rounded-full items-center justify-center border-2 border-white border-opacity-50 text-offWhite w-full">
              <Slider.Root
                className=" bg-red-500 relative items-center w-full h-5 flex-col"
                orientation="horizontal"
                defaultValue={[mainVolume]}
                max={100}
              >
                <Slider.Track className="relative flex-1 bg-blue-500">
                  <Slider.Range className="absolute bg-black w-full" />
                </Slider.Track>
                <Slider.Thumb className="w-7 h-7 bg-violet-500 block" />
              </Slider.Root>
            </div>
          </div>
        </div>
      </div>

      {children}
    </>
  );
}
