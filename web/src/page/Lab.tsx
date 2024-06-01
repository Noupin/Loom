import { transform } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

const images = [
  "https://cdn3.vox-cdn.com/thumbor/eKbukOC7ZHVXSxbUR2sH-NfwoOw=/0x1080/volume-assets.voxmedia.com/production/56997d157bef3ac54865f47e5106dfcd/rogueone.jpg",
  "https://static1.moviewebimages.com/wordpress/wp-content/uploads/2023/01/the-last-of-us-cordyceps.jpg",
  "https://cdn.theatlantic.com/thumbor/qMFv8_ojwskcxzZcOC7IqdX-bsk=/93x30:1308x713/960x540/media/img/mt/2017/10/br/original.jpg",
  "https://www.indiewire.com/wp-content/uploads/2020/05/0520-Dune-Timothee-Solo-Tout-e1630027112271.jpg",
];

const Lab: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [focusedItem, setFocusedItem] = useState<number>(0);
  const [renderedItems, setRenderedItems] = useState<JSX.Element[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const rotateCarousel = (angle: number) => {
    if (carouselRef.current) {
      carouselRef.current.style.transform = `rotate(${angle}deg)`;
    }
  };

  useEffect(() => {
    rotateCarousel(rotationAngle);
  }, [rotationAngle]);

  const handleWheel = (event: WheelEvent) => {
    const scrollingDown = event.deltaY > 0;

    if (scrollingDown) {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
      setRotationAngle((prevAngle) => prevAngle - 90);
    } else {
      setActiveIndex(
        (prevIndex) => (prevIndex - 1 + images.length) % images.length
      );
      setRotationAngle((prevAngle) => prevAngle + 90);
    }
  };

  useEffect(() => {
    window.addEventListener("wheel", handleWheel);
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const renderImages = () => {
    const itemsToRender = [
      activeIndex,
      (activeIndex - 1 + images.length) % images.length,
      (activeIndex + 1) % images.length,
    ];
    const renderedItems = [];
    for (let index of itemsToRender) {
      renderedItems.push(
        <div
          style={{
            transformOrigin: "center",
            transform: `rotate(${-rotationAngle}deg) translateX(100%)`, // Counter-rotate the images
            ...getSlidePosition(index),
          }}
          className="absolute transition-transform duration-500 flex flex-col"
        >
          <img
            src={images[index]}
            alt={`Slide ${index + 1}`}
            key={index}
            className={`h-[40vh] w-[40vh] object-cover`}
          />
          <h2 className="w-full p-5 bg-slate-200 text-center">Hello</h2>
        </div>
      );
    }
    // return renderedItems;
    return images.map((src, index) => {
      if (
        index === activeIndex ||
        index === (activeIndex - 1 + images.length) % images.length ||
        index === (activeIndex + 1) % images.length
      ) {
        return (
          <div
            style={{
              transformOrigin: "center",
              transform: `rotate(${-rotationAngle}deg)`, // Counter-rotate the images
              ...getSlidePosition(index),
            }}
            className="absolute transition-transform duration-500 block"
          >
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              key={index}
              className={`h-[40vh] w-[40vh] object-cover`}
            />
            <h2 className="w-full p-5 bg-slate-200 text-center">Hello</h2>
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div className="h-screen flex flex-col justify-around items-center overflow-hidden relative bg-off z-[-2]">
      <div
        className="absolute z-[-1] left-0 w-[120vh] h-[120vh] rounded-full flex justify-center items-center transition-transform duration-1000"
        ref={carouselRef}
      >
        {renderImages()}
      </div>
    </div>
  );
};

const getSlidePosition = (index: number): React.CSSProperties => {
  const positionMap = [
    { right: "0" },
    { bottom: "0" },
    { left: "0" },
    { top: "0" },
  ];

  const relativeIndex = index % 4;

  return positionMap[relativeIndex];
};

export default Lab;
