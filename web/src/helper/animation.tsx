import { TAnimateStatus } from "../types/TAnimation";

export const runAnimationPipeline = (
  setIsAnimating: React.Dispatch<
    React.SetStateAction<{
      [key: string]: TAnimateStatus;
    }>
  >,
  animations: {
    animationKeys: string[];
    durations: number[];
    callbacks?: (() => void)[];
  }[]
) => {
  let currentAnimationIndex = 0;

  const runNextAnimation = () => {
    if (currentAnimationIndex < animations.length) {
      const { animationKeys, durations, callbacks } =
        animations[currentAnimationIndex];

      // Set a timeout for the next animation step
      const allAnimationsTimeoutId = setTimeout(() => {
        currentAnimationIndex++;
        runNextAnimation();
      }, Math.max(...durations));

      // Start and set timeouts for each animation in this step
      animationKeys.forEach((key, index) => {
        // console.log(`Animation ${key} started`);
        setIsAnimating((prev) => ({
          ...prev,
          [key]: TAnimateStatus.ANIMATING,
        }));

        const timeoutId = setTimeout(() => {
          // console.log(`Animation ${key} finished after ${durations[index]}ms`);
          setIsAnimating((prev) => ({
            ...prev,
            [key]: TAnimateStatus.DONE,
          }));

          // Optional callback
          if (callbacks && callbacks[index]) {
            callbacks[index]();
          }
        }, durations[index]);

        return () => clearTimeout(timeoutId);
      });
      return () => clearTimeout(allAnimationsTimeoutId);
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

  // console.log("START of pipeline steps.");
  // animations.forEach((animation, index) => {
  //   console.log(`Step ${index + 1}`);
  //   const { animationKeys, durations } = animation;
  //   animationKeys.forEach((key, index) => {
  //     console.log(`${key}: ${durations[index]}`);
  //   });
  // });
  // console.log("END of pipeline steps.");

  runNextAnimation();
};

export const getAnimationTiming = (
  key: string,
  timings: { [key: string]: number },
  isFocused: boolean
) => {
  return isFocused ? timings[key] : timings[key] / 10;
};
