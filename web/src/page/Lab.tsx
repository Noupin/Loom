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

  const rotateCarousel = (angle: number) => {
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(-50%) rotate(${angle}deg)`;
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

  const handleControlClick = (index: number) => {
    setActiveIndex(index);
    setRotationAngle(-index * 90);
  };

  const renderImages = () => {
    return images.map((src, index) => {
      if (
        index === activeIndex ||
        index === (activeIndex - 1 + images.length) % images.length ||
        index === (activeIndex + 1) % images.length
      ) {
        return (
          <div
            key={index}
            className={`absolute h-[100px] w-[100px] object-cover transition-transform duration-500 ${
              index === activeIndex ? "scale-[2.5]" : ""
            }`}
            style={{
              transformOrigin: "center",
              transform: `rotate(${-rotationAngle}deg)`, // Counter-rotate the images
              ...getSlidePosition(index),
            }}
          >
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              className="w-full object-cover"
            />
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div className="h-screen flex flex-col justify-around items-center bg-antiquewhite overflow-hidden">
      <div
        className="absolute left-0 w-[30vw] h-[30vw] border-[2rem] border-[#eebe97] rounded-full flex justify-center items-center transition-transform duration-1000"
        ref={carouselRef}
      >
        {renderImages()}
      </div>
    </div>
  );
};

const getSlidePosition = (index: number): React.CSSProperties => {
  const positionMap = [
    { right: "-20rem" },
    { bottom: "-20rem" },
    { left: "-20rem" },
    { top: "-20rem" },
  ];

  const relativeIndex = index % 4;

  return positionMap[relativeIndex];
};

export default Lab;
