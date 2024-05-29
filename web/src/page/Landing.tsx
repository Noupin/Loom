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

function Landing() {
  const setLogoType = useSetRecoilState(logoState);
  const [leftHandMode, setLeftHandMode] = useRecoilState(leftHandModeState);
  const [darkMode, setDarkMode] = useRecoilState(darkModeState);
  const [expandSearch, setExpandSearch] = useState(false);
  const [currentStoryIdx, setCurrentStoryIdx] = useState(1);

  const stories = [
    {
      title: "Android Tragedy",
      authors: "Jane Doe & Mary Sue",
      timeToRead: "13 min read",
      genres: ["Science Fiction", "Drama", "Romance", "16+"],
      description:
        "In the year 2042, a sentient android named Artemis escapes its creators, embarking on a journey of self-discovery and facing the harsh realities of a world wary of artificial intelligence.",
      image:
        "https://cdn3.vox-cdn.com/thumbor/eKbukOC7ZHVXSxbUR2sH-NfwoOw=/0x1080/volume-assets.voxmedia.com/production/56997d157bef3ac54865f47e5106dfcd/rogueone.jpg",
    },
    {
      title: "The Last of Us",
      authors: "John Doe & Mary Smith",
      timeToRead: "8 min read",
      genres: ["Horror", "Thriller", "Survival", "16+"],
      description:
        "In a post-apocalyptic world ravaged by a fungal infection, a hardened survivor named Joel is tasked with escort",
      image:
        "https://static1.moviewebimages.com/wordpress/wp-content/uploads/2023/01/the-last-of-us-cordyceps.jpg",
    },
  ];

  useEffect(() => {
    setLogoType(TLogo.Logo);
  }, []);

  return (
    <main className="flex flex-col w-full h-full bg-off dark:bg-off-500 font-lateef dark:text-off">
      <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col h-full items-center justify-center">
        {stories.map((story, idx) => (
          <div
            key={idx}
            className={`flex h-full items-center ${
              idx === currentStoryIdx ? "" : "hidden"
            }`}
          >
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
        ))}
      </div>

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
        <MoveVertical strokeWidth={2} className="mr-auto" />

        <div className="ml-auto">
          <Progress current={currentStoryIdx} max={stories.length - 1} />
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
