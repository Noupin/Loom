import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useAnimationPipeline } from "../helper/animation";
import { TAnimateStatus } from "../types/TAnimation";
import { useRecoilValue } from "recoil";
import { darkModeState } from "../State";

interface LandingNavigationProps {
  expandSearch: boolean;
  setExpandSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

const LandingNavigation: React.FC<LandingNavigationProps> = ({
  expandSearch,
  setExpandSearch,
}) => {
  const darkMode = useRecoilValue(darkModeState);
  const [searchTerm, setSearchTerm] = useState("");
  const isPipelineRunning = useRef(false);
  const [cancelState, setCancelState] = useState(false);
  const runAnimationPipeline = useAnimationPipeline(
    cancelState,
    setCancelState,
    isPipelineRunning
  );
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [animationState, setAnimationState] = useState<{
    [key: string]: TAnimateStatus;
  }>({
    flipSearchIcon: TAnimateStatus.START,
    expandSearch: TAnimateStatus.START,
    fadeSearchText: TAnimateStatus.START,
  });
  const AnimationTiming = {
    flipSearchIcon: 200,
    expandSearch: 300,
    fadeSearchText: 100,
  };
  const animations = [
    {
      animationKeys: ["flipSearchIcon"],
      durations: [AnimationTiming.flipSearchIcon],
    },
    {
      animationKeys: ["expandSearch"],
      durations: [AnimationTiming.expandSearch],
    },
    {
      animationKeys: ["fadeSearchText"],
      durations: [AnimationTiming.fadeSearchText],
    },
  ];

  const expandSearchCondition =
    animationState.expandSearch === TAnimateStatus.DONE && expandSearch;
  const flipSearchIconCondition =
    animationState.flipSearchIcon === TAnimateStatus.DONE && expandSearch;
  const fadeSearchTextCondition =
    animationState.fadeSearchText === TAnimateStatus.DONE && expandSearch;

  useEffect(() => {
    if (!expandSearch) {
      setCancelState(true);
      setAnimationState({
        flipSearchIcon: TAnimateStatus.START,
        expandSearch: TAnimateStatus.START,
        fadeSearchText: TAnimateStatus.START,
      });
      return;
    }
    if (isPipelineRunning.current) return;
    runAnimationPipeline(setAnimationState, animations);
  }, [expandSearch]);

  useEffect(() => {
    if (fadeSearchTextCondition) {
      searchInputRef.current?.focus();
    }
  }, [fadeSearchTextCondition]);

  return (
    <div className="h-[50px] flex mt-[25px] mx-[25px] items-center relative z-[1]">
      <div className="flex-1" />
      <div className="flex-[2] flex text-center text-2xl">
        <div className="flex-1">Textiles</div>
        <div className="flex-1">Genres</div>
        <div className="flex-1">Platform</div>
      </div>
      <div
        className="flex ml-5 justify-end transition-[flex-grow] ease-in-out"
        style={{
          flexGrow: expandSearchCondition ? 2 : 1,
          transitionDuration: `${AnimationTiming.expandSearch}ms`,
        }}
      >
        <div
          className="flex justify-start px-3 py-2 box-content rounded-full transition-[width]
          text-clip items center ease-in-out"
          style={{
            width: expandSearchCondition ? "80%" : "25px",
            transitionDuration: `${AnimationTiming.expandSearch}ms`,
            backgroundColor: expandSearchCondition
              ? darkMode
                ? "rgba(255, 255, 255, 0.15)"
                : "rgba(0, 0, 0, 0.15)"
              : "transparent",
          }}
          onMouseLeave={() => {
            if (searchTerm.length > 0) return;
            setExpandSearch(false);
          }}
          onMouseEnter={() => {
            setExpandSearch(true);
          }}
        >
          <Search
            className="transition-transform"
            style={{
              transitionDuration: `${AnimationTiming.flipSearchIcon}ms`,
            }}
            transform={flipSearchIconCondition ? "scale(-1, 1)" : "scale(1, 1)"}
          />
          <input
            ref={searchInputRef}
            type="text"
            className="transition-[flex-grow] ml-1 placeholder-black placeholder-opacity-50
            dark:placeholder-white dark:placeholder-opacity-50 bg-transparent border-none outline-none"
            placeholder="Search..."
            autoFocus
            style={{
              display: fadeSearchTextCondition ? "flex" : "none",
              flexGrow: fadeSearchTextCondition ? 1 : 0,
              transitionDuration: `${AnimationTiming.fadeSearchText}ms`,
            }}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (e.target.value.length === 0) setExpandSearch(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LandingNavigation;
