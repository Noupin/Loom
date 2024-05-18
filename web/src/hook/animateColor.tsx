import { useState, useEffect, useRef } from "react";
import { blendColors } from "../helper/color";

export function useAnimateColor(
  colorFrom: string,
  colorTo: string,
  setColor: (color: string) => void,
  loop: boolean = false,
  speed: number = 1,
  progress?: number
) {
  const [reverse, setReverse] = useState(false);
  const [colorOpacity, setColorOpacity] = useState(
    progress !== undefined ? progress : 0
  );
  const colorOpacityRef = useRef(colorOpacity);
  colorOpacityRef.current = colorOpacity;

  useEffect(() => {
    if (progress !== undefined) {
      const opacityOne = progress;
      const opacityTwo = 1 - opacityOne;
      setColor(blendColors(colorFrom, colorTo, opacityOne, opacityTwo));
      return;
    }

    const interval = setInterval(() => {
      const opacityOne = colorOpacityRef.current;
      const opacityTwo = 1 - colorOpacityRef.current;

      setColor(blendColors(colorFrom, colorTo, opacityOne, opacityTwo));

      const step = 0.01 * speed;

      if (reverse) {
        setColorOpacity((prevOpacity) => {
          const newOpacity = prevOpacity - step;
          if (newOpacity <= 0) {
            if (loop) {
              setReverse(false);
            } else {
              clearInterval(interval);
            }
          }
          return newOpacity;
        });
      } else {
        setColorOpacity((prevOpacity) => {
          const newOpacity = prevOpacity + step;
          if (newOpacity >= 1) {
            if (loop) {
              setReverse(true);
            } else {
              clearInterval(interval);
            }
          }
          return newOpacity;
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [colorFrom, colorTo, setColor, loop, reverse, speed, progress]);

  useEffect(() => {
    if (progress === undefined) {
      colorOpacityRef.current = colorOpacity;
    }
  }, [colorOpacity, progress]);
}
