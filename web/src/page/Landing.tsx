import { useRecoilState, useSetRecoilState } from "recoil";
import { darkModeState, leftHandModeState, logoState } from "../State";
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
import { STORIES, TStory } from "../Stories";

function Landing() {
  const setLogoType = useSetRecoilState(logoState);
  const [leftHandMode, setLeftHandMode] = useRecoilState(leftHandModeState);
  const [darkMode, setDarkMode] = useRecoilState(darkModeState);
  const [expandSearch, setExpandSearch] = useState(false);
  const [focusedStoryIndex, setFocusedStoryIndex] = useState(0);
  const [expandStory, setExpandStory] = useState(false);
  const [storiesToRender, setStoriesToRender] = useState<TStory[]>([]);
  const [rotationAngle, setRotationAngle] = useState(0);

  const getPreviousStoryIdx = (currentIndex: number) => {
    return (currentIndex - 1 + STORIES.length) % STORIES.length;
  };

  const getNextStoryIdx = (currentIndex: number) => {
    return (currentIndex + 1) % STORIES.length;
  };

  const handleWheel = (event: WheelEvent) => {
    const scrollingDown = event.deltaY > 0;

    if (scrollingDown) {
      setFocusedStoryIndex((currentIndex) => getNextStoryIdx(currentIndex));
      setRotationAngle((prevAngle) => prevAngle - 90);
    } else {
      setFocusedStoryIndex((currentIndex) => getPreviousStoryIdx(currentIndex));
      setRotationAngle((prevAngle) => prevAngle + 90);
    }
  };

  const carouselTransformMap: { [key: number]: React.CSSProperties } = {
    0: {
      transform: `rotate(${rotationAngle}deg)`,
    },
    1: {
      transform: `rotate(${rotationAngle + 90}deg)`,
    },
    2: {
      transform: `rotate(${rotationAngle + 180}deg)`,
    },
    3: {
      transform: `rotate(${rotationAngle + 270}deg)`,
    },
  };

  useEffect(() => {
    setStoriesToRender([
      STORIES[focusedStoryIndex],
      STORIES[getNextStoryIdx(focusedStoryIndex)],
    ]);
  }, [focusedStoryIndex]);

  useEffect(() => {
    setLogoType(TLogo.Logo);

    window.addEventListener("wheel", handleWheel);
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <main className="z-[-2] relative flex animate flex-col w-full h-full bg-off dark:bg-off-500 font-lateef dark:text-off">
      {STORIES.map((story, idx) => (
        <div
          key={idx}
          className="absolute z-0 w-[100%] h-[100%] border-0 border-orange-400 transition-transform duration-300 flex justify-center items-center"
          style={{
            transformOrigin: "left center",
            ...carouselTransformMap[idx],
          }}
        >
          <div className="bg-off dark:bg-off-500 dark:text-off flex items-center">
            <img
              src={story.image}
              alt={story.title}
              className="h-[40vh] w-[40vh] object-cover translate-x-[20%] drop-shadow-img dark:drop-shadow-img-white"
            />
            <div className="text-black invert mix-blend-difference translate-x-[-20%] text-end h-[40vh] flex flex-col items-end">
              <div className="text-8xl mt-24">{story.title}</div>
              <div className="text-3xl pr-8">{story.authors}</div>
              <div className="flex-1 flex justify-end items-end">
                <ArrowRight />
              </div>
            </div>
          </div>
        </div>
      ))}

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

      <div className="flex-1 justify-center items-center p-5 flex flex-row relative z-[-1]">
        <MoveVertical strokeWidth={2} className="mr-auto" />

        <div className="ml-auto">
          <Progress current={focusedStoryIndex} max={STORIES.length - 1} />
        </div>
      </div>

      <div className="flex justify-between p-5">
        <div className="flex font-mono select-none items-end">Frv-01</div>
        <div className="flex flex-col">
          <div className="flex justify-around items-end">
            <ControlFrame
              className="p-1 w-fit cursor-pointer"
              onClick={() => setLeftHandMode((current) => !current)}
            >
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
