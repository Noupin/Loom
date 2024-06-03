import { useRecoilState, useSetRecoilState } from "recoil";
import { darkModeState, leftHandModeState, logoState } from "../State";
import { useEffect, useRef, useState } from "react";
import { TLogo } from "../types/TLogo";
import {
  ArrowLeftToLine,
  ArrowRight,
  ArrowRightToLine,
  Moon,
  MoveVertical,
  Search,
  Sun,
} from "lucide-react";
import Progress from "../component/Progress";
import ControlFrame from "../component/ControlFrame";
import { STORIES } from "../Stories";
import Button from "../component/Button";

function Landing() {
  const AnimationTiming = {
    carouselRotation: 600,
    itemSetInPlace: 300,
    overlayTransform: 300,
    overlayWidth: 1200,
    overlayAnimation: 1000,
    expandedStoryFade: 1500,
    quickScrollDelay: 100,
    offsetForSetInAfterRotation: 200,
    pageLoadSetInDelay: 500,
    leftHandSwitch: 200,
  };
  const EXPANDED_STORY_ANIMATION_CLASSES = "transition-colors ease-in-out";
  const setLogoType = useSetRecoilState(logoState);
  const [leftHandMode, setLeftHandMode] = useRecoilState(leftHandModeState);
  const [darkMode, setDarkMode] = useRecoilState(darkModeState);
  const [expandSearch, setExpandSearch] = useState(false);
  const [focusedStoryIndex, setFocusedStoryIndex] = useState(0);
  const carouselIndexRef = useRef(0);
  const [expandStory, setExpandStory] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const isScrollingRef = useRef(false);
  const touchStartY = useRef(0);
  const [isAnimating, setIsAnimating] = useState({
    carouselRotation: false,
    itemSetInPlace: false,
    overlayTransform: false,
    overlayWidth: false,
    expandedStoryFade: false,
  });

  const getPreviousStoryIdx = (currentIndex: number) => {
    return (currentIndex - 1 + STORIES.length) % STORIES.length;
  };

  const getNextStoryIdx = (currentIndex: number) => {
    return (currentIndex + 1) % STORIES.length;
  };

  const trackOverlayWidthAndExpandedFade = () => {
    setIsAnimating({ ...isAnimating, overlayWidth: true });
    setTimeout(() => {
      setIsAnimating({ ...isAnimating, overlayWidth: false });
    }, AnimationTiming.overlayWidth);

    setIsAnimating({ ...isAnimating, expandedStoryFade: true });
    setTimeout(() => {
      setIsAnimating({ ...isAnimating, expandedStoryFade: false });
    }, AnimationTiming.expandedStoryFade);
  };

  const trackOverlayTransform = () => {
    setIsAnimating({ ...isAnimating, overlayTransform: true });
    setTimeout(() => {
      setIsAnimating({ ...isAnimating, overlayTransform: false });
      trackOverlayWidthAndExpandedFade();
    }, AnimationTiming.overlayTransform);
  };

  const trackSetInPlace = (index: number) => {
    setIsAnimating({ ...isAnimating, itemSetInPlace: true });
    setTimeout(() => {
      setIsAnimating({ ...isAnimating, itemSetInPlace: false });
      if (index === carouselIndexRef.current) {
        setExpandStory(true);
      }

      trackOverlayTransform();
    }, AnimationTiming.itemSetInPlace);
  };

  const trackCarouselRotate = () => {
    setIsAnimating({ ...isAnimating, carouselRotation: true });
    setTimeout(() => {
      setIsAnimating({ ...isAnimating, carouselRotation: false });
      trackSetInPlace(carouselIndexRef.current);
    }, AnimationTiming.carouselRotation + 200); //TODO: Offset to allow for the setIn animation to be started after
  };

  const trackAnimations = () => {
    trackCarouselRotate();
  };

  const handleWheel = (event: WheelEvent) => {
    const scrollingDown = event.deltaY > 0;
    if (isScrollingRef.current) return;
    // If at the end of the carousel or at the beginning, do not scroll
    if (
      (scrollingDown && carouselIndexRef.current >= STORIES.length - 1) ||
      (!scrollingDown && carouselIndexRef.current <= 0)
    )
      return;
    isScrollingRef.current = true;

    if (scrollingDown && carouselIndexRef.current < STORIES.length - 1) {
      setExpandStory(false);
      setFocusedStoryIndex((currentIndex) => getNextStoryIdx(currentIndex));
      carouselIndexRef.current += 1;
      setRotationAngle((prevAngle) => prevAngle - 90);
    } else if (!scrollingDown && carouselIndexRef.current > 0) {
      setExpandStory(false); //move into track animations
      setFocusedStoryIndex((currentIndex) => getPreviousStoryIdx(currentIndex));
      carouselIndexRef.current -= 1;
      setRotationAngle((prevAngle) => prevAngle + 90);
    }

    //TODO: Temp fix for scrolling too fast for display to switch from none to flex
    setTimeout(() => {
      isScrollingRef.current = false;
    }, AnimationTiming.quickScrollDelay);
    trackAnimations();
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
      setExpandStory(false);
      setFocusedStoryIndex((currentIndex) => getNextStoryIdx(currentIndex));
      carouselIndexRef.current += 1;
      setRotationAngle((prevAngle) => prevAngle - 90);
    } else if (!scrollingDown && carouselIndexRef.current > 0) {
      setExpandStory(false);
      setFocusedStoryIndex((currentIndex) => getPreviousStoryIdx(currentIndex));
      carouselIndexRef.current -= 1;
      setRotationAngle((prevAngle) => prevAngle + 90);
    }

    // Use setTimeout to reset the flag after the transition duration
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 100);
    trackAnimations();
  };

  const carouselTransformMap: { [key: number]: string } = {
    0: `rotate(${rotationAngle}deg)`,
    1: `rotate(${rotationAngle + 90}deg)`,
    2: `rotate(${rotationAngle + 180}deg)`,
    3: `rotate(${rotationAngle + 270}deg)`,
  };

  useEffect(() => {
    setLogoType(TLogo.Logo);
    setTimeout(() => {
      trackSetInPlace(carouselIndexRef.current);
    }, AnimationTiming.pageLoadSetInDelay);

    window.addEventListener("wheel", handleWheel);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <main
      className="z-[-2] relative flex animate flex-col w-full h-full bg-off dark:bg-off-500
    font-lateef dark:text-off"
    >
      <div className="h-[50px] flex mt-[25px] mx-[25px] items-center relative z-1">
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
              className="flex-1 ml-1 placeholder-black placeholder-opacity-50 bg-transparent
              border-none outline-none"
              placeholder="Search..."
            />
          </div>
        ) : (
          <div className="flex flex-1 justify-end">
            <Search />
          </div>
        )}
      </div>

      {STORIES.map(
        (story, idx) =>
          carouselIndexRef.current - 1 <= idx &&
          idx <= carouselIndexRef.current + 1 && (
            <div
              key={idx}
              className="absolute z-0 w-[100%] h-[100%] transition-transform flex
              justify-center items-center"
              style={{
                transformOrigin: "left center",
                transitionDuration: `${AnimationTiming.carouselRotation}ms`,
                transform: `${carouselTransformMap[idx % 4]} ${
                  carouselIndexRef.current - 1 == idx ? "translateY(-100%)" : ""
                } ${
                  carouselIndexRef.current + 1 == idx ? "translateY(100%)" : ""
                }`,
              }}
            >
              <div
                className="bg-off dark:bg-off-500 dark:text-off flex items-center justify-center
                transition-transform duration-[1ms] ease-in-out lg:flex-row md:flex-col origin-center"
                style={{
                  transform: focusedStoryIndex !== idx ? "scale(100%)" : "",
                  animation:
                    !isAnimating.carouselRotation && focusedStoryIndex === idx
                      ? `setIntoPlaceFromBottom ${AnimationTiming.itemSetInPlace}ms ease-out`
                      : "",
                }}
              >
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-[40vh] my-5 object-cover drop-shadow-img dark:drop-shadow-img-white
                  transition-[transform, height]"
                  style={{
                    transitionDuration: `${AnimationTiming.overlayTransform}ms`,
                    ...(expandStory && focusedStoryIndex == idx
                      ? { transform: "translateX(0%)", height: "40vh" }
                      : { transform: "translateX(20%)", height: "40vh" }),
                  }}
                />
                <div
                  className="h-[40vh] w-[40vw] flex flex-col items-end
                  self-end text-black invert mix-blend-difference ml-5"
                >
                  <div
                    className={`flex flex-row justify-between px-5 w-full ${EXPANDED_STORY_ANIMATION_CLASSES}`}
                    style={{
                      color:
                        expandStory && focusedStoryIndex == idx
                          ? "inherit"
                          : "transparent",
                      transitionDuration: `${AnimationTiming.expandedStoryFade}ms`,
                    }}
                  >
                    <div className="text-2xl">{story.timeToRead}</div>
                    <div className="text-2xl">
                      {story.genres.map((genre, idx) => {
                        if (idx < story.genres.length - 1) return genre + ", ";
                        return genre;
                      })}
                    </div>
                  </div>

                  <div className="flex w-full flex-1">
                    <div
                      className="transition-[transform, flex-grow] ease-in-out text-end self-start justify-end flex flex-col h-full"
                      style={{
                        flexGrow:
                          expandStory && focusedStoryIndex == idx ? "1" : "0",
                        transform:
                          expandStory && focusedStoryIndex == idx
                            ? "translateX(0%)"
                            : "translateX(-20%)",
                        transitionDuration: `${AnimationTiming.overlayAnimation}ms`,
                      }}
                    >
                      <div className="text-8xl">{story.title}</div>
                      <div className="text-3xl -translate-x-5">
                        {story.authors}
                      </div>
                    </div>
                  </div>

                  <p
                    className={`text-wrap text-center mt-10 mb-5 px-8 ${EXPANDED_STORY_ANIMATION_CLASSES}`}
                    style={{
                      color:
                        expandStory && focusedStoryIndex == idx
                          ? "inherit"
                          : "transparent",
                      transitionDuration: `${AnimationTiming.expandedStoryFade}ms`,
                    }}
                  >
                    {story.description}
                  </p>
                  <Button
                    onClick={() => {}}
                    className={`${
                      expandStory && focusedStoryIndex == idx
                        ? "bg-off-500 text-off"
                        : "bg-transparent text-transparent"
                    } mt-auto w-[80%] flex flex-row justify-center self-center py-2 ${EXPANDED_STORY_ANIMATION_CLASSES}`}
                    style={{
                      transitionDuration: `${AnimationTiming.expandedStoryFade}ms`,
                    }}
                  >
                    Read <ArrowRight />
                  </Button>
                </div>
              </div>
            </div>
          )
      )}
      <div className="flex-1 justify-center items-center p-5 flex flex-row relative z-[-1]">
        <MoveVertical strokeWidth={2} className="mr-auto" />

        <div className="ml-auto">
          <Progress current={focusedStoryIndex} max={STORIES.length - 1} />
        </div>
      </div>
      <div className="flex flex-col relative z-1">
        <div
          className="flex px-5 transition-[width] ease-in-out justify-end min-w-fit"
          style={{
            width: leftHandMode ? "0%" : "100%",
            transitionDuration: `${AnimationTiming.leftHandSwitch}ms`,
          }}
        >
          <ControlFrame
            className="p-1 w-fit cursor-pointer mr-2"
            onClick={() => setLeftHandMode((current) => !current)}
          >
            {leftHandMode ? (
              <ArrowRightToLine height={20} width={20} strokeWidth={1} />
            ) : (
              <ArrowLeftToLine height={20} width={20} strokeWidth={1} />
            )}
          </ControlFrame>
          <ControlFrame
            className="p-1 w-fit cursor-pointer ml-2"
            onClick={() => setDarkMode((current) => !current)}
          >
            {darkMode ? (
              <Moon height={20} width={20} strokeWidth={1} />
            ) : (
              <Sun height={20} width={20} strokeWidth={1} />
            )}
          </ControlFrame>
        </div>
        <div className="flex justify-between px-5 pb-5 pt-3">
          <div className="flex font-mono select-none items-end">
            FRV-1 07May2024
          </div>
          <div className="flex font-barcode text-2xl select-none">
            No
            {"0".repeat(
              STORIES.length.toString().length -
                focusedStoryIndex.toString().length
            )}
            {focusedStoryIndex} {STORIES[focusedStoryIndex].datePublished}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Landing;
