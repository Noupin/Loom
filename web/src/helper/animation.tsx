import { useEffect, useRef } from "react";
import { TAnimateStatus } from "../types/TAnimation";

export const useAnimationPipeline = (
  cancelState: boolean,
  setCancelState: React.Dispatch<React.SetStateAction<boolean>>,
  isPipelineRunning: React.MutableRefObject<boolean>
) => {
  const timeoutsRef = useRef<number[]>([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const runAnimationPipeline = (
    setIsAnimating: React.Dispatch<
      React.SetStateAction<{
        [key: string]: TAnimateStatus;
      }>
    >,
    animations: {
      animationKeys: string[];
      durations: number[];
      callbacks?: (() => void)[];
      cancelPipelineConditions?: (() => boolean)[];
    }[]
  ) => {
    if (isPipelineRunning.current) return;

    let currentAnimationIndex = 0;
    isPipelineRunning.current = true;

    const runNextAnimation = () => {
      if (currentAnimationIndex < animations.length) {
        const {
          animationKeys,
          durations,
          callbacks,
          cancelPipelineConditions,
        } = animations[currentAnimationIndex];

        // Set a timeout for the next animation step
        const allAnimationsTimeoutId = window.setTimeout(() => {
          currentAnimationIndex++;
          runNextAnimation();
        }, Math.max(...durations));
        timeoutsRef.current.push(allAnimationsTimeoutId);

        // Start and set timeouts for each animation in this step
        animationKeys.forEach((key, index) => {
          if (
            cancelPipelineConditions &&
            cancelPipelineConditions[index] &&
            cancelPipelineConditions[index]()
          ) {
            setCancelState(true);
            return;
          }

          setIsAnimating((prev) => ({
            ...prev,
            [key]: TAnimateStatus.ANIMATING,
          }));

          const timeoutId = window.setTimeout(() => {
            setIsAnimating((prev) => ({
              ...prev,
              [key]: TAnimateStatus.DONE,
            }));

            // Optional callback
            if (callbacks && callbacks[index]) {
              callbacks[index]();
            }
          }, durations[index]);
          timeoutsRef.current.push(timeoutId);
        });
      } else {
        isPipelineRunning.current = false;
      }
    };

    // Set all animationKeys to START
    setIsAnimating((prev) => {
      const newState = { ...prev };
      animations[currentAnimationIndex].animationKeys.forEach((key) => {
        newState[key] = TAnimateStatus.START;
      });
      return newState;
    });

    runNextAnimation();
  };

  useEffect(() => {
    if (cancelState) {
      clearAllTimeouts();
      setCancelState(false);
      isPipelineRunning.current = false;
    }
  }, [cancelState]);

  return runAnimationPipeline;
};

export const getAnimationTiming = (
  key: string,
  timings: { [key: string]: number },
  isFocused: boolean
) => {
  return isFocused ? timings[key] : timings[key] / 10;
};

export const wpmToMs = (wpm: number): number => {
  const wordsPerSecond = wpm / 60;
  const secondsPerWord = 1 / wordsPerSecond;
  const millisecondsPerWord = secondsPerWord * 1000;
  return millisecondsPerWord;
};
