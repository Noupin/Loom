import { useRecoilState, useSetRecoilState } from "recoil";
import { darkModeState, logoState } from "../State";
import { useEffect, useState } from "react";
import { TLogo } from "../types/TLogo";
import {
  ArrowLeftToLine,
  ArrowRight,
  Moon,
  MoveVertical,
  Search,
  Sun,
} from "lucide-react";
import Progress from "../component/Progress";
import ControlFrame from "../component/ControlFrame";

function Landing() {
  const setLogoType = useSetRecoilState(logoState);
  const [darkMode, setDarkMode] = useRecoilState(darkModeState);
  const [expandSearch, setExpandSearch] = useState(false);
  const [currentStoryIdx, setCurrentStoryIdx] = useState(0);

  useEffect(() => {
    setLogoType(TLogo.Logo);
  }, []);

  return (
    <main className="flex flex-col w-full h-full bg-off dark:bg-off-500 font-lateef dark:text-off">
      {/* Matches the logo dimensions */}
      <div className="h-[50px] flex mt-[25px] mx-[25px] items-center">
        <div className="flex-1" />

        <div className="flex-[2] flex text-center text-2xl">
          <div className="flex-1">Textiles</div>
          <div className="flex-1">Genres</div>
          <div className="flex-1">Platform</div>
        </div>

        {expandSearch ? (
          <div className="flex flex-[2] ml-5 px-3 py-2 bg-black bg-opacity-25 rounded-full">
            <Search transform="scale(-1, 1)" />
            <input
              type="text"
              className="flex-1 ml-1 placeholder-black placeholder-opacity-50 bg-transparent border-none outline-none"
              placeholder="Search..."
            />
          </div>
        ) : (
          <div className="flex flex-1 justify-end">
            <Search />
          </div>
        )}
      </div>

      <div className="flex-1 justify-center items-center p-5 flex flex-row">
        <MoveVertical strokeWidth={1} className="ml-auto" />
        <div className="flex flex-col h-full items-center justify-center">
          <div className="flex h-full items-center">
            <img
              src="https://cdn3.vox-cdn.com/thumbor/eKbukOC7ZHVXSxbUR2sH-NfwoOw=/0x1080/volume-assets.voxmedia.com/production/56997d157bef3ac54865f47e5106dfcd/rogueone.jpg"
              alt="Rogue One"
              className="h-[40vh] w-[40vh] object-cover translate-x-[20%] drop-shadow-img"
            />
            <div className="text-black invert mix-blend-difference translate-x-[-20%] text-end h-[40vh] flex flex-col items-end">
              <div className="text-8xl mt-24">Android Tragedy</div>
              <div className="text-3xl pr-8">Jane Doe & Mary Sue</div>
              <div className="flex-1 flex justify-end items-end">
                <ArrowRight />
              </div>
            </div>
          </div>
        </div>

        <div className="ml-auto">
          <Progress current={currentStoryIdx} max={4} />
        </div>
      </div>

      <div className="flex justify-between p-5">
        <div className="flex font-mono select-none">Frv-01</div>
        <div className="flex flex-col">
          <div className="flex justify-around items-end">
            <ControlFrame className="p-1 w-fit">
              <ArrowLeftToLine height={20} width={20} strokeWidth={1} />
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
          <div className="flex font-barcode text-2xl select-none">
            No1 27May2024
          </div>
        </div>
      </div>
    </main>
  );
}

export default Landing;
