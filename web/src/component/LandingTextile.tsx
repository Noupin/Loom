import React from "react";
import { ArrowRight } from "lucide-react";
import { IStory } from "../Stories";
import { TAnimateStatus } from "../types/TAnimation";
import Button from "./Button";
import { getAnimationTiming } from "../helper/animation";
import { useNavigate } from "react-router-dom";
import { formatContributors, formatTimeToRead } from "../helper/formatting";
import { Config } from "../Config";
import { deviceScreenSizeState } from "../State";
import { useRecoilValue } from "recoil";
import { TScreenSize } from "../types/TScreenSize";

interface LandingTextileProps {
  story: IStory;
  idx: number;
  animationState: {
    [key: string]: TAnimateStatus;
  };
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
  const navigate = useNavigate();
  const deviceScreenSize = useRecoilValue(deviceScreenSizeState);
  const EXPANDED_STORY_ANIMATION_CLASSES = "transition-colors ease-in-out";
  const itemSetInPlace =
    animationState.itemSetInPlace === TAnimateStatus.DONE &&
    focusedStoryIndex === idx &&
    idx === carouselIndexRef.current;
  const preSetInDelay =
    animationState.preSetInDelay === TAnimateStatus.DONE &&
    focusedStoryIndex === idx &&
    idx === carouselIndexRef.current;

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
        className="bg-off dark:bg-off-500 dark:text-off flex items-center justify-center
        flex-col lg:flex-row origin-center transition-colors"
        style={{
          animation: preSetInDelay
            ? `setIntoPlaceFromBottom ${getAnimationTiming(
                "itemSetInPlace",
                AnimationTiming,
                preSetInDelay
              )}ms ease-out`
            : "",
          transitionDuration: `${Config.darkModeSwitchDuration}ms`,
        }}
      >
        <img
          src={story.image}
          alt={story.title}
          className="w-[30vh] my-5 object-cover drop-shadow-img-mobile dark:drop-shadow-img-white-mobile
          lg:drop-shadow-img lg:dark:drop-shadow-img-white transition-[transform, height] lg:w-[40vh]"
          style={{
            transform:
              deviceScreenSize === TScreenSize.Large
                ? itemSetInPlace
                  ? "translateX(0%)"
                  : "translateX(20%)"
                : itemSetInPlace
                ? "translateY(0%)"
                : "translateY(25%)",
            height: deviceScreenSize === TScreenSize.Large ? "40vh" : "30vh",
            transitionDuration: `${getAnimationTiming(
              "overlayAnimation",
              AnimationTiming,
              itemSetInPlace
            )}ms`,
          }}
        />
        <div
          className="h-fit w-[80vw] flex flex-col items-end self-end text-black invert mix-blend-difference
          m-0 lg:ml-5 lg:w-[40vw] "
        >
          <div
            className={`flex flex-row justify-between px-5 w-full ${EXPANDED_STORY_ANIMATION_CLASSES}`}
            style={{
              color: itemSetInPlace ? "inherit" : "transparent",
              transitionDuration: `${getAnimationTiming(
                "expandedStoryFade",
                AnimationTiming,
                itemSetInPlace
              )}ms`,
            }}
          >
            <div className="md:text-2xl text-md text-start">
              {formatTimeToRead(story.timeToRead)}
            </div>
            <div className="md:text-2xl text-md text-end">
              {story.genres.join(", ")}
            </div>
          </div>
          <div className="flex w-full flex-1">
            <div
              className="transition-[transform, flex-grow] ease-in-out text-center lg:text-end
              self-start justify-end flex flex-col h-full"
              style={{
                flexGrow:
                  deviceScreenSize === TScreenSize.Large
                    ? itemSetInPlace
                      ? "1"
                      : "0"
                    : 1,
                transform:
                  deviceScreenSize === TScreenSize.Large
                    ? itemSetInPlace
                      ? "translateX(0%)"
                      : "translateX(-20%)"
                    : itemSetInPlace
                    ? "translateY(0%)"
                    : "translateY(-25%)",
                transitionDuration: `${getAnimationTiming(
                  "overlayAnimation",
                  AnimationTiming,
                  itemSetInPlace
                )}ms`,
              }}
            >
              <div className="lg:text-8xl md:text-6xl text-4xl">
                {story.title}
              </div>
              <div className="lg:text-3xl md:text-2xl text-xl lg:-translate-x-5">
                {formatContributors([...story.contributors])}
              </div>
            </div>
          </div>
          <p
            className={`text-wrap text-center mt-5 mb-2 md:mt-10 md:mb-5 px-8 ${EXPANDED_STORY_ANIMATION_CLASSES}`}
            style={{
              color: itemSetInPlace ? "inherit" : "transparent",
              transitionDuration: `${getAnimationTiming(
                "expandedStoryFade",
                AnimationTiming,
                itemSetInPlace
              )}ms`,
            }}
          >
            {story.description}
          </p>
          <Button
            onClick={() => navigate(story.link)}
            className={`${
              itemSetInPlace
                ? "bg-off-500 text-off"
                : "bg-transparent text-transparent"
            } mt-auto w-[80%] flex flex-row justify-center self-center py-2 md:py-3 ${EXPANDED_STORY_ANIMATION_CLASSES}`}
            style={{
              transitionDuration: `${getAnimationTiming(
                "expandedStoryFade",
                AnimationTiming,
                itemSetInPlace
              )}ms`,
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
