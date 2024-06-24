import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useAnimationPipeline } from "../helper/animation";
import { TAnimateStatus } from "../types/TAnimation";
import { useRecoilValue } from "recoil";
import { darkModeState, logoDimensionState } from "../State";
import { autoCompleteSearchStories } from "../helper/search";
import { Config } from "../Config";
import { IStory } from "../Stories";
import { useNavigate } from "react-router-dom";

interface LandingNavigationProps {
  expandSearch: boolean;
  setExpandSearch: React.Dispatch<React.SetStateAction<boolean>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const LandingNavigation: React.FC<LandingNavigationProps> = ({
  expandSearch,
  setExpandSearch,
  searchTerm,
  setSearchTerm,
}) => {
  const navigate = useNavigate();
  const darkMode = useRecoilValue(darkModeState);
  const logoDimension = useRecoilValue(logoDimensionState);
  const isPipelineRunning = useRef(false);
  const [cancelState, setCancelState] = useState(false);
  const [autoCompleteResults, setAutoCompleteResults] = useState<IStory[]>([]);
  const runAnimationPipeline = useAnimationPipeline(
    cancelState,
    setCancelState,
    isPipelineRunning
  );
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [mouseInSearchArea, setMouseInSearchArea] = useState(false);
  const [mouseInResultsArea, setMouseInResultsArea] = useState(false);
  const [searchResultsHeight, setSearchResultsHeight] = useState(0);

  const [animationState, setAnimationState] = useState<{
    [key: string]: TAnimateStatus;
  }>({
    flipSearchIcon: TAnimateStatus.START,
    expandSearch: TAnimateStatus.START,
    fadeSearchText: TAnimateStatus.START,
    searchResultsHeight: TAnimateStatus.START,
  });
  const AnimationTiming = {
    flipSearchIcon: 100,
    expandSearch: 300,
    fadeSearchText: 100,
    resultHoverBackgroundChange: 300,
    searchResultsHeight: 350,
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

  const searchResultsAnimations = [
    {
      animationKeys: ["searchResultsHeight"],
      durations: [AnimationTiming.searchResultsHeight],
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

  useEffect(() => {
    if (isPipelineRunning.current) setCancelState(true);
    if (searchTerm.length === 0) {
      setAutoCompleteResults([]);
      return;
    }

    const searchResults = autoCompleteSearchStories(
      searchTerm,
      Config.autoCompleteSearchResultLimit
    );
    setAutoCompleteResults(searchResults);
  }, [searchTerm]);

  useEffect(() => {
    if (autoCompleteResults.length === 0) {
      setSearchResultsHeight(0);
      return;
    }

    setSearchResultsHeight(
      autoCompleteResults.length * Config.searchResultItemHeight +
        Config.searchResultsPaddingAndMarginHeight
    );
  }, [autoCompleteResults]);

  useEffect(() => {
    if (searchResultsHeight === 0) return;
    runAnimationPipeline(setAnimationState, searchResultsAnimations);
  }, [searchResultsHeight]);

  return (
    <div
      className="flex items-center relative z-[1]"
      style={{
        height: `${logoDimension * 2}px`,
        padding: `${logoDimension / 2}px`,
      }}
    >
      <div className="flex-1" />
      <div className="flex-[2] flex text-center text-2xl flex-col lg:flex-row opacity-0 lg:opacity-100">
        {/* <div className="flex-1">Textiles</div>
        <div className="flex-1">Genres</div>
        <div className="flex-1">Platform</div> */}
      </div>
      <div
        className="flex flex-col ml-5 justify-end items-end transition-[flex-grow] ease-in-out"
        style={{
          flexGrow: expandSearchCondition ? 2 : 1,
          transitionDuration: `${AnimationTiming.expandSearch}ms`,
        }}
      >
        <div
          className="relative flex justify-start px-3 py-2 box-content rounded-full transition-[width]
          text-clip items center ease-in-out"
          style={{
            width: expandSearchCondition ? "80%" : "25px",
            transitionDuration: `${Config.darkModeSwitchDuration}ms`,
            backgroundColor: expandSearchCondition
              ? darkMode
                ? "rgba(255, 255, 255, 0.15)"
                : "rgba(0, 0, 0, 0.15)"
              : "transparent",
          }}
          onMouseLeave={() => {
            setMouseInSearchArea(false);
            if (searchTerm.length > 0) return;
            setExpandSearch(false);
          }}
          onMouseEnter={() => {
            setExpandSearch(true);
            setMouseInSearchArea(true);
          }}
        >
          <Search
            className="transition-transform"
            style={{
              transitionDuration: `${AnimationTiming.flipSearchIcon}ms`,
              transform: flipSearchIconCondition
                ? "rotate(90deg)"
                : "rotate(0deg)",
            }}
          />
          {/* TODO: Fix animation time for dark mode switch */}
          <input
            ref={searchInputRef}
            type="text"
            className="transition-[flex-grow, background-color, opacity] ml-1 placeholder-black placeholder-opacity-50
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
              if (
                e.target.value.length === 0 &&
                (!mouseInSearchArea || mouseInResultsArea)
              )
                setExpandSearch(false);
            }}
          />

          <div
            className="absolute top-[100%] mt-3 w-full left-0"
            style={{
              transitionDuration: `${AnimationTiming.searchResultsHeight}ms`,
              opacity: autoCompleteResults.length > 0 ? 1 : 0,
            }}
          >
            <div
              className="bg-black bg-opacity-15 rounded-3xl dark:bg-white dark:bg-opacity-15
            transition-[background-color]"
              style={{
                transitionDuration: `${Config.darkModeSwitchDuration}ms`,
              }}
            >
              <div
                className=" flex flex-col  transition-[height]
              overflow-hidden rounded-3xl p-2"
                style={{
                  transitionDuration: `${AnimationTiming.searchResultsHeight}ms`,
                  height: `${searchResultsHeight}px`,
                }}
                onMouseEnter={() => setMouseInResultsArea(true)}
                onMouseLeave={() => setMouseInResultsArea(false)}
              >
                {autoCompleteResults.map((result, idx) => (
                  <div
                    key={idx}
                    className="hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10
                cursor-pointer px-3 py-1 rounded-3xl transition-[background-color, opacity, color] ease-in-out
                text-black dark:text-white"
                    style={{
                      transitionDuration: `${AnimationTiming.resultHoverBackgroundChange}ms`,
                    }}
                    onClick={() => navigate(result.link)}
                  >
                    {result.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingNavigation;
