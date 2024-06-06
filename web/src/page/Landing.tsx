import { useRecoilState, useSetRecoilState } from "recoil";
import { darkModeState, leftHandModeState, logoState } from "../State";
import { useEffect, useRef, useState } from "react";
import { TLogo } from "../types/TLogo";
import { MoveVertical } from "lucide-react";
import Progress from "../component/Progress";
import { STORIES } from "../Stories";
import { TAnimateStatus } from "../types/TAnimation";
import { getNextStoryIdx, getPreviousStoryIdx } from "../helper/carousel";
import { useAnimationPipeline } from "../helper/animation";
import LandingNavigation from "../component/LandingNavigation";
import LandingTextile from "../component/LandingTextile";
import LandingControls from "../component/LandingControls";

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
    offsetForSetInAfterRotation: 200,
    leftHandSwitch: 200,
    preSetInDelay: 500,
    darkModeSwitch: 300,
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
    const scrollingDown = event.deltaY > 0;
    if (isScrollingRef.current) return;
    // If at the end of the carousel or at the beginning, do not scroll
    if (
      (scrollingDown && carouselIndexRef.current >= STORIES.length - 1) ||
      (!scrollingDown && carouselIndexRef.current <= 0)
    )
      return;

    if (isPipelineRunning.current) {
      setCancelState(true);
    }
    isScrollingRef.current = true;

    if (scrollingDown && carouselIndexRef.current < STORIES.length - 1) {
      resetCarouselAnimations();
      setFocusedStoryIndex((currentIndex) => getNextStoryIdx(currentIndex));
      carouselIndexRef.current += 1;
      setRotationAngle((prevAngle) => prevAngle - 90);
    } else if (!scrollingDown && carouselIndexRef.current > 0) {
      resetCarouselAnimations();
      setFocusedStoryIndex((currentIndex) => getPreviousStoryIdx(currentIndex));
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

    isScrollingRef.current = true; // Set the flag to prevent further scrolling

    if (scrollingDown && carouselIndexRef.current < STORIES.length - 1) {
      resetCarouselAnimations();
      setFocusedStoryIndex((currentIndex) => getNextStoryIdx(currentIndex));
      carouselIndexRef.current += 1;
      setRotationAngle((prevAngle) => prevAngle - 90);
    } else if (!scrollingDown && carouselIndexRef.current > 0) {
      resetCarouselAnimations();
      setFocusedStoryIndex((currentIndex) => getPreviousStoryIdx(currentIndex));
      carouselIndexRef.current -= 1;
      setRotationAngle((prevAngle) => prevAngle + 90);
    }

    // Use setTimeout to reset the flag after the transition duration
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 100);
  };

  useEffect(() => {
    setLogoType(TLogo.Logo);
    runAnimationPipeline(setAnimationState, pageLoadAnimationPipeline);

    window.addEventListener("wheel", handleWheel);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

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

  return (
    <main
      className="z-[-2] relative flex animate flex-col w-full h-full bg-off
    dark:bg-off-500 font-lateef dark:text-off transition-colors"
      style={{
        transitionDuration: `${AnimationTiming.darkModeSwitch}ms`,
      }}
    >
      <LandingNavigation
        expandSearch={expandSearch}
        setExpandSearch={setExpandSearch}
      />
      {STORIES.map(
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
      <div className="flex-1 justify-center items-center p-5 flex flex-row relative z-[-1]">
        <MoveVertical strokeWidth={2} className="mr-auto" />
        <div className="ml-auto">
          <Progress
            current={focusedStoryIndex}
            max={STORIES.length - 1}
            transitionDuration={AnimationTiming.darkModeSwitch}
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
      />
    </main>
  );
}

export default Landing;
