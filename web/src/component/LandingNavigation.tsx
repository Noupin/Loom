import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useAnimationPipeline } from "../helper/animation";
import { TAnimateStatus } from "../types/TAnimation";

interface LandingNavigationProps {
  expandSearch: boolean;
  setExpandSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

const LandingNavigation: React.FC<LandingNavigationProps> = ({
  expandSearch,
  setExpandSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const isPipelineRunning = useRef(false);
  const [cancelState, setCancelState] = useState(false);
  const runAnimationPipeline = useAnimationPipeline(
    cancelState,
    setCancelState,
    isPipelineRunning
  );

  const [animationState, setAnimationState] = useState<{
    [key: string]: TAnimateStatus;
  }>({
    flipSearchIcon: TAnimateStatus.START,
    expandSearch: TAnimateStatus.START,
    fadeSearchText: TAnimateStatus.START,
  });
  const AnimationTimings = {
    flipSearchIcon: 200,
    expandSearch: 300,
    fadeSearchText: 100,
  };
  const animations = [
    {
      animationKeys: ["flipSearchIcon"],
      durations: [AnimationTimings.flipSearchIcon],
    },
    {
      animationKeys: ["expandSearch"],
      durations: [AnimationTimings.expandSearch],
    },
    {
      animationKeys: ["fadeSearchText"],
      durations: [AnimationTimings.fadeSearchText],
    },
  ];

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

  const expandSearchCondition =
    animationState.expandSearch === TAnimateStatus.DONE && expandSearch;
  const flipSearchIconCondition =
    animationState.flipSearchIcon === TAnimateStatus.DONE && expandSearch;
  const fadeSearchTextCondition =
    animationState.fadeSearchText === TAnimateStatus.DONE && expandSearch;

  return (
    <div className="h-[50px] flex mt-[25px] mx-[25px] items-center relative z-[1]">
      <div className="flex-1" />
      <div className="flex-[2] flex text-center text-2xl">
        <div className="flex-1">Textiles</div>
        <div className="flex-1">Genres</div>
        <div className="flex-1">Platform</div>
      </div>
      <div
        className="flex ml-5 justify-end transition-[flex-grow]"
        style={{
          flexGrow: expandSearchCondition ? 2 : 1,
          transitionDuration: `${AnimationTimings.expandSearch}ms`,
        }}
      >
        <div
          className="flex justify-start px-3 py-2 box-content rounded-full transition-[width] text-clip"
          style={{
            width: expandSearchCondition ? "75%" : "25px",
            transitionDuration: `${AnimationTimings.expandSearch}ms`,
            backgroundColor: expandSearchCondition
              ? "rgba(0, 0, 0, 0.15)"
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
              transitionDuration: `${AnimationTimings.flipSearchIcon}ms`,
            }}
            transform={flipSearchIconCondition ? "scale(-1, 1)" : "scale(1, 1)"}
          />
          <input
            type="text"
            className="transition-[flex-grow] ml-1 placeholder-black placeholder-opacity-50 bg-transparent border-none outline-none"
            placeholder="Search..."
            autoFocus={true}
            style={{
              display: fadeSearchTextCondition ? "flex" : "none",
              flexGrow: fadeSearchTextCondition ? 1 : 0,
              transitionDuration: `${AnimationTimings.fadeSearchText}ms`,
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
