import { useRecoilState, useSetRecoilState } from "recoil";
import { darkModeState, logoState } from "../State";
import { useEffect, useRef, useState } from "react";
import { TLogo } from "../types/TLogo";
import { ArrowDown } from "lucide-react";
import { IStory, STORIES } from "../Stories";
import { TAnimateStatus } from "../types/TAnimation";
import { getNextStoryIdx, getPreviousStoryIdx } from "../helper/carousel";
import { useAnimationPipeline } from "../helper/animation";
import LandingNavigation from "../component/LandingNavigation";
import LandingTextile from "../component/LandingTextile";
import LandingControls from "../component/LandingControls";
import { fuzzySearchStories } from "../helper/search";
import { Config } from "../Config";
import { TScrollDirection } from "../types/TScrollDirection";
import { CircularProgress } from "../component/CircularProgress";

function Landing() {
  const setLogoType = useSetRecoilState(logoState);
  const [darkMode, setDarkMode] = useRecoilState(darkModeState);
  const [expandSearch, setExpandSearch] = useState(false);
  const [focusedStoryIndex, setFocusedStoryIndex] = useState(0);
  const carouselIndexRef = useRef(0);
  const [rotationAngle, setRotationAngle] = useState(0);
  const isScrollingRef = useRef(false);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const touchEndY = useRef(0);
  const touchEndX = useRef(0);
  const accumulatedTrackPadScroll = useRef(0);
  const isPipelineRunning = useRef(false);
  const [cancelState, setCancelState] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStories, setFilteredStories] = useState<IStory[]>([
    ...STORIES,
  ]);
  const runAnimationPipeline = useAnimationPipeline(
    cancelState,
    setCancelState,
    isPipelineRunning
  );

  const [animationState, setAnimationState] = useState<{
    [key: string]: TAnimateStatus;
  }>({
    carouselRotation: TAnimateStatus.DONE,
    preSetInDelay: TAnimateStatus.START,
    itemSetInPlace: TAnimateStatus.START,
    overlayAnimation: TAnimateStatus.START,
    expandedStoryFade: TAnimateStatus.START,
  });
  const [AnimationTiming, setAnimationTiming] = useState({
    carouselRotation: 600,
    itemSetInPlace: 300,
    overlayAnimation: 1000,
    expandedStoryFade: 1500,
    scrollDebounce: 100,
    offsetForSetInAfterRotation: 100,
    preSetInDelay: 500,
    noResults: 200,
  });

  const pageLoadAnimationPipeline = [
    {
      animationKeys: ["preSetInDelay"],
      durations: [AnimationTiming.preSetInDelay],
    },
    {
      animationKeys: ["itemSetInPlace"],
      durations: [AnimationTiming.itemSetInPlace],
      callbacks: [
        () => {
          setAnimationTiming((prev) => ({
            ...prev,
            preSetInDelay: AnimationTiming.offsetForSetInAfterRotation,
          }));
        },
      ],
    },
    {
      animationKeys: ["overlayAnimation", "expandedStoryFade"],
      durations: [
        AnimationTiming.overlayAnimation,
        AnimationTiming.expandedStoryFade,
      ],
    },
  ];

  const carouselAnimationPipeline = [
    {
      animationKeys: ["carouselRotation"],
      durations: [AnimationTiming.carouselRotation],
    },
    {
      animationKeys: ["preSetInDelay"],
      durations: [AnimationTiming.preSetInDelay],
    },
    {
      animationKeys: ["itemSetInPlace"],
      durations: [AnimationTiming.itemSetInPlace],
    },
    {
      animationKeys: ["overlayAnimation", "expandedStoryFade"],
      durations: [
        AnimationTiming.overlayAnimation,
        AnimationTiming.expandedStoryFade,
      ],
    },
  ];

  const carouselAnimationDependencies = [
    "carouselRotation",
    "preSetInDelay",
    "itemSetInPlace",
    "overlayTransform",
    "expandedStoryFade",
  ];

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    if (event.deltaMode === 1) {
      if (event.deltaY > Config.wheelEventThreshold) {
        scroll(TScrollDirection.Down);
      } else if (event.deltaY < -Config.wheelEventThreshold) {
        scroll(TScrollDirection.Up);
      }
    } else if (event.deltaMode === 0) {
      accumulatedTrackPadScroll.current += event.deltaY;
      // Handle trackpad
      if (accumulatedTrackPadScroll.current > Config.trackPadEventThreshold) {
        accumulatedTrackPadScroll.current = 0;
        scroll(TScrollDirection.Down);
      } else if (
        accumulatedTrackPadScroll.current < -Config.trackPadEventThreshold
      ) {
        accumulatedTrackPadScroll.current = 0;
        scroll(TScrollDirection.Up);
      }
    }
  };

  const handleTouchStart = (event: TouchEvent) => {
    touchStartY.current = event.touches[0].clientY;
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchMove = (event: TouchEvent) => {
    event.preventDefault();
    touchEndY.current = event.touches[0].clientY;
    touchEndX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const touchDeltaY = touchStartY.current - touchEndY.current;
    const touchDeltaX = touchStartX.current - touchEndX.current;

    if (Math.abs(touchDeltaY) > Math.abs(touchDeltaX)) {
      if (touchDeltaY > Config.touchEventThreshold) {
        scroll(TScrollDirection.Down);
      } else if (touchDeltaY < -Config.touchEventThreshold) {
        scroll(TScrollDirection.Up);
      }
    }
  };

  const arrowKeyPressed = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      scroll(TScrollDirection.Down);
    } else if (event.key === "ArrowUp") {
      scroll(TScrollDirection.Up);
    }
  };

  const scroll = (direction: TScrollDirection) => {
    if (isScrollingRef.current) return; // Prevent firing if scrolling is in progress

    // If at the end of the carousel or at the beginning, do not scroll
    if (
      (direction === TScrollDirection.Down &&
        carouselIndexRef.current >= filteredStories.length - 1) ||
      (direction === TScrollDirection.Up && carouselIndexRef.current <= 0)
    )
      return;

    if (isPipelineRunning.current) {
      setCancelState(true);
    }
    isScrollingRef.current = true;

    if (
      direction === TScrollDirection.Down &&
      carouselIndexRef.current < filteredStories.length - 1
    ) {
      resetCarouselAnimations();
      setFocusedStoryIndex((currentIndex) =>
        getNextStoryIdx(currentIndex, filteredStories)
      );
      carouselIndexRef.current += 1;
      setRotationAngle((prevAngle) => prevAngle - 90);
    } else if (
      direction === TScrollDirection.Up &&
      carouselIndexRef.current > 0
    ) {
      resetCarouselAnimations();
      setFocusedStoryIndex((currentIndex) =>
        getPreviousStoryIdx(currentIndex, filteredStories)
      );
      carouselIndexRef.current -= 1;
      setRotationAngle((prevAngle) => prevAngle + 90);
    }

    //TODO: Temp fix for scrolling too fast for display to switch from none to flex
    setTimeout(() => {
      isScrollingRef.current = false;
    }, AnimationTiming.scrollDebounce);
  };

  useEffect(() => {
    setLogoType(TLogo.Logo);
    runAnimationPipeline(setAnimationState, pageLoadAnimationPipeline);
  }, []);

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", arrowKeyPressed);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", arrowKeyPressed);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [filteredStories]);

  // Reset carousel animation dependency states to START state
  const resetCarouselAnimations = () => {
    const newState: { [key: string]: TAnimateStatus } = {};
    carouselAnimationDependencies.forEach((key) => {
      newState[key] = TAnimateStatus.START;
    });
    setAnimationState((prev) => ({
      ...prev,
      ...newState,
    }));
  };

  // Checking if all carousel animations are in START state
  useEffect(
    () => {
      if (
        carouselAnimationDependencies.every(
          (key) => animationState[key] === TAnimateStatus.START
        )
      ) {
        runAnimationPipeline(setAnimationState, carouselAnimationPipeline);
      }
    },
    carouselAnimationDependencies.map((key) => animationState[key])
  );

  const resetCarousel = () => {
    carouselIndexRef.current = 0;
    setFocusedStoryIndex(0);
    setRotationAngle(0);
  };

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredStories([...STORIES]);
      return;
    }
    resetCarousel();
    setFilteredStories(fuzzySearchStories(searchTerm));
  }, [searchTerm]);

  return (
    <main
      className="z-[-1] relative flex animate flex-col w-full h-full bg-off
    dark:bg-off-500 font-lateef dark:text-off transition-colors overflow-hidden"
      style={{
        transitionDuration: `${Config.darkModeSwitchDuration}ms`,
      }}
    >
      <LandingNavigation
        expandSearch={expandSearch}
        setExpandSearch={setExpandSearch}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      {filteredStories.length > 0 &&
        filteredStories.map(
          (story, idx) =>
            carouselIndexRef.current - 1 <= idx &&
            idx <= carouselIndexRef.current + 1 && (
              <LandingTextile
                key={idx}
                story={story}
                idx={idx}
                animationState={animationState}
                focusedStoryIndex={focusedStoryIndex}
                carouselIndexRef={carouselIndexRef}
                AnimationTiming={AnimationTiming}
                rotationAngle={rotationAngle}
              />
            )
        )}
      <div className="flex-1 justify-center items-center p-2 md:p-5 flex flex-row">
        <div
          className="flex-1 flex flex-col text-center transition-[opacity] items-center"
          style={{
            opacity: filteredStories.length === 0 ? 1 : 0,
            transitionDuration: `${AnimationTiming.noResults}ms`,
          }}
        >
          <span
            className="text-black dark:text-white text-3xl transition-colors"
            style={{
              transitionDuration: `${Config.darkModeSwitchDuration}ms`,
            }}
          >
            No results found but look down
          </span>
          <ArrowDown strokeWidth={2} />
        </div>
      </div>
      <LandingControls
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        focusedStoryIndex={focusedStoryIndex}
        filteredStories={filteredStories}
      />

      <div className="absolute h-full flex items-center right-2 md:right-4 z-10">
        <CircularProgress
          current={focusedStoryIndex}
          max={filteredStories.length}
        />
      </div>
    </main>
  );
}

export default Landing;
