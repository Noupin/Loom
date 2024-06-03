import React, { useEffect, useRef, useState } from "react";

const Lab = () => {
  const [initialWidth, setInitialWidth] = useState("auto");
  const [animate, setAnimate] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const measuredWidth = ref.current.scrollWidth;
      setInitialWidth(`${measuredWidth}px`);
    }
  }, [ref]);

  return (
    <div className="inline-block whitespace-nowrap w-full h-full bg-slate-300">
      <div
        ref={ref}
        className={`transition-all bg-blue-200 duration-1000 ease-in-out overflow-hidden ${
          animate ? "w-full" : "fit-content"
        }`}
        style={{ width: animate ? "100%" : initialWidth }}
        onMouseEnter={() => setAnimate(true)}
        onMouseLeave={() => setAnimate(false)}
      >
        Your content here that needs to expand from fit-content to 100% width.
      </div>
    </div>
  );
};

export default Lab;
