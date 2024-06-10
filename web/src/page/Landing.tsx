import { useRecoilState, useSetRecoilState } from "recoil";
import { darkModeState, leftHandModeState, logoState } from "../State";
import { useEffect, useRef, useState } from "react";
import { TLogo } from "../types/TLogo";
import { ArrowDown, MoveVertical } from "lucide-react";
import Progress from "../component/Progress";
import { IStory, STORIES } from "../Stories";
import { TAnimateStatus } from "../types/TAnimation";
import { getNextStoryIdx, getPreviousStoryIdx } from "../helper/carousel";
import { useAnimationPipeline } from "../helper/animation";
import LandingNavigation from "../component/LandingNavigation";
import LandingTextile from "../component/LandingTextile";
import LandingControls from "../component/LandingControls";
import { fuzzySearchStories } from "../helper/search";
import { Config } from "../Config";

function Landing() {
  // State
  const setLogoType = useSetRecoilState(logoState);
  const [leftHandMode, setLeftHandMode] = useRecoilState(leftHandModeState);
  const [darkMode, setDarkMode] = useRecoilState(darkModeState);
  const [expandSearch, setExpandSearch] = useState(false);
  const [focusedStoryIndex, setFocusedStoryIndex] = useState(0);
  const carouselIndexRef = useRef(0);
  const [rotationAngle, setRotationAngle] = useState(0);
  const isScrollingRef = useRef(false);
  const touchStartY = useRef(0);
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

  // Animation
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
    quickScrollDelay: 100,
    offsetForSetInAfterRotation: 100,
    leftHandSwitch: 200,
    preSetInDelay: 500,
    flipLeftHandModeIcon: 350,
    moreStoriesOpacity: 200,
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
    if (isScrollingRef.current) return; // Prevent firing if scrolling is in progress
    const scrollingDown = event.deltaY > 0;
    // If at the end of the carousel or at the beginning, do not scroll
    if (
      (scrollingDown &&
        carouselIndexRef.current >= filteredStories.length - 1) ||
      (!scrollingDown && carouselIndexRef.current <= 0)
    )
      return;

    if (isPipelineRunning.current) {
      setCancelState(true);
    }
    isScrollingRef.current = true;

    if (
      scrollingDown &&
      carouselIndexRef.current < filteredStories.length - 1
    ) {
      resetCarouselAnimations();
      setFocusedStoryIndex((currentIndex) =>
        getNextStoryIdx(currentIndex, filteredStories)
      );
      carouselIndexRef.current += 1;
      setRotationAngle((prevAngle) => prevAngle - 90);
    } else if (!scrollingDown && carouselIndexRef.current > 0) {
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
    }, AnimationTiming.quickScrollDelay);
  };

  const handleTouchStart = (event: TouchEvent) => {
    touchStartY.current = event.touches[0].clientY;
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (isScrollingRef.current) return; // Prevent firing if scrolling is in progress
    const touchEndY = event.touches[0].clientY;
    const touchDeltaY = touchStartY.current - touchEndY;
    const scrollingDown = touchDeltaY > 0;

    // If at the end of the carousel or at the beginning, do not scroll
    if (
      (scrollingDown &&
        carouselIndexRef.current >= filteredStories.length - 1) ||
      (!scrollingDown && carouselIndexRef.current <= 0)
    )
      return;

    if (isPipelineRunning.current) {
      setCancelState(true);
    }
    isScrollingRef.current = true;

    if (
      scrollingDown &&
      carouselIndexRef.current < filteredStories.length - 1
    ) {
      resetCarouselAnimations();
      setFocusedStoryIndex((currentIndex) =>
        getNextStoryIdx(currentIndex, filteredStories)
      );
      carouselIndexRef.current += 1;
      setRotationAngle((prevAngle) => prevAngle - 90);
    } else if (!scrollingDown && carouselIndexRef.current > 0) {
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
    }, AnimationTiming.quickScrollDelay);
  };

  useEffect(() => {
    setLogoType(TLogo.Logo);
    runAnimationPipeline(setAnimationState, pageLoadAnimationPipeline);
  }, []);

  useEffect(() => {
    window.addEventListener("wheel", handleWheel);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
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
    dark:bg-off-500 font-lateef dark:text-off transition-colors"
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
      <div className="flex-1 justify-center items-center p-2 md:p-5 flex flex-row relative z-[-1]">
        <div className="flex justify-start opacity-0 xl:opacity-100">
          <MoveVertical strokeWidth={2} />
        </div>
        <div
          className="flex-1 flex flex-col text-center transition-[opacity] items-center"
          style={{
            opacity: filteredStories.length === 0 ? 1 : 0,
            transitionDuration: `${AnimationTiming.moreStoriesOpacity}ms`,
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
        <div className="flex justify-end">
          <Progress
            current={focusedStoryIndex}
            max={Math.max(filteredStories.length - 1, 0)}
            transitionDuration={Config.darkModeSwitchDuration}
          />
        </div>
      </div>
      <LandingControls
        leftHandMode={leftHandMode}
        setLeftHandMode={setLeftHandMode}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        AnimationTiming={AnimationTiming}
        focusedStoryIndex={focusedStoryIndex}
        filteredStories={filteredStories}
      />
    </main>
  );
}

export default Landing;
