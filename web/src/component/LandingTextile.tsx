import React from "react";
import { ArrowRight } from "lucide-react";
import { IStory } from "../Stories";
import { TAnimateStatus } from "../types/TAnimation";
import Button from "./Button";

interface LandingTextileProps {
  story: IStory;
  idx: number;
  animationState: any; // Replace 'any' with the appropriate type
  focusedStoryIndex: number;
  carouselIndexRef: React.MutableRefObject<number>;
  AnimationTiming: { [key: string]: number };
  rotationAngle: number;
}

const LandingTextile: React.FC<LandingTextileProps> = ({
  story,
  idx,
  animationState,
  focusedStoryIndex,
  carouselIndexRef,
  AnimationTiming,
  rotationAngle,
}) => {
  const EXPANDED_STORY_ANIMATION_CLASSES = "transition-colors ease-in-out";
  const itemSetInPlace =
    animationState.itemSetInPlace === TAnimateStatus.DONE &&
    focusedStoryIndex === idx;
  const preSetInDelay =
    animationState.preSetInDelay === TAnimateStatus.DONE &&
    focusedStoryIndex === idx;

  const carouselTransformMap: { [key: number]: string } = {
    0: `rotate(${rotationAngle}deg)`,
    1: `rotate(${rotationAngle + 90}deg)`,
    2: `rotate(${rotationAngle + 180}deg)`,
    3: `rotate(${rotationAngle + 270}deg)`,
  };

  return (
    <div
      key={idx}
      className="absolute z-0 w-[100%] h-[100%] transition-transform flex justify-center items-center"
      style={{
        transformOrigin: "left center",
        transitionDuration: `${AnimationTiming.carouselRotation}ms`,
        transform: `${carouselTransformMap[idx % 4]} ${
          carouselIndexRef.current - 1 === idx ? "translateY(-100%)" : ""
        } ${carouselIndexRef.current + 1 === idx ? "translateY(100%)" : ""}`,
      }}
    >
      <div
        className="bg-off dark:bg-off-500 dark:text-off flex items-center justify-center transition-transform duration-[1ms] ease-in-out lg:flex-row md:flex-col origin-center"
        style={{
          animation: preSetInDelay
            ? `setIntoPlaceFromBottom ${AnimationTiming.itemSetInPlace}ms ease-out`
            : "",
        }}
      >
        <img
          src={story.image}
          alt={story.title}
          className="w-[40vh] my-5 object-cover drop-shadow-img dark:drop-shadow-img-white transition-[transform, height]"
          style={{
            transitionDuration: `${AnimationTiming.overlayAnimation}ms`,
            transform: itemSetInPlace ? "translateX(0%)" : "translateX(20%)",
            height: "40vh",
          }}
        />
        <div className="h-[40vh] w-[40vw] flex flex-col items-end self-end text-black invert mix-blend-difference ml-5">
          <div
            className={`flex flex-row justify-between px-5 w-full ${EXPANDED_STORY_ANIMATION_CLASSES}`}
            style={{
              color: itemSetInPlace ? "inherit" : "transparent",
              transitionDuration: `${AnimationTiming.expandedStoryFade}ms`,
            }}
          >
            <div className="text-2xl">{story.timeToRead}</div>
            <div className="text-2xl">{story.genres.join(", ")}</div>
          </div>
          <div className="flex w-full flex-1">
            <div
              className="transition-[transform, flex-grow] ease-in-out text-end self-start justify-end flex flex-col h-full"
              style={{
                flexGrow: itemSetInPlace ? "1" : "0",
                transform: itemSetInPlace
                  ? "translateX(0%)"
                  : "translateX(-20%)",
                transitionDuration: `${AnimationTiming.overlayAnimation}ms`,
              }}
            >
              <div className="text-8xl">{story.title}</div>
              <div className="text-3xl -translate-x-5">{story.authors}</div>
            </div>
          </div>
          <p
            className={`text-wrap text-center mt-10 mb-5 px-8 ${EXPANDED_STORY_ANIMATION_CLASSES}`}
            style={{
              color: itemSetInPlace ? "inherit" : "transparent",
              transitionDuration: `${AnimationTiming.expandedStoryFade}ms`,
            }}
          >
            {story.description}
          </p>
          <Button
            onClick={() => {}}
            className={`${
              itemSetInPlace
                ? "bg-off-500 text-off"
                : "bg-transparent text-transparent"
            } mt-auto w-[80%] flex flex-row justify-center self-center py-3 ${EXPANDED_STORY_ANIMATION_CLASSES}`}
            style={{
              transitionDuration: `${AnimationTiming.expandedStoryFade}ms`,
            }}
          >
            Read <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingTextile;
