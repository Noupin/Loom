// src/Lab.tsx
import React, { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const items = [
  {
    title: "Android Tragedy",
    authors: "Jane Doe & Mary Sue",
    timeToRead: "13 min read",
    genres: ["Science Fiction", "Drama", "Romance", "16+"],
    description:
      "In the year 2042, a sentient android named Artemis escapes its creators, embarking on a journey of self-discovery and facing the harsh realities of a world wary of artificial intelligence.",
    image:
      "https://cdn3.vox-cdn.com/thumbor/eKbukOC7ZHVXSxbUR2sH-NfwoOw=/0x1080/volume-assets.voxmedia.com/production/56997d157bef3ac54865f47e5106dfcd/rogueone.jpg",
  },
  {
    title: "The Last of Us",
    authors: "John Doe & Mary Smith",
    timeToRead: "8 min read",
    genres: ["Horror", "Thriller", "Survival", "16+"],
    description:
      "In a post-apocalyptic world ravaged by a fungal infection, a hardened survivor named Joel is tasked with escort",
    image:
      "https://static1.moviewebimages.com/wordpress/wp-content/uploads/2023/01/the-last-of-us-cordyceps.jpg",
  },
  {
    title: "Blade Runner",
    authors: "John Smith & Mary Doe",
    timeToRead: "9 min read",
    genres: ["Science Fiction", "Drama", "Thriller", "16+"],
    description:
      "In a post-apocalyptic world ravaged by a fungal infection, a hardened survivor named Joel is tasked with escort",
    image:
      "https://cdn.theatlantic.com/thumbor/qMFv8_ojwskcxzZcOC7IqdX-bsk=/93x30:1308x713/960x540/media/img/mt/2017/10/br/original.jpg",
  },
];

const variants = {
  enter: (direction: number) => ({
    rotate: direction > 0 ? 90 : -90,
    x: direction > 0 ? 200 : -200,
    y: direction > 0 ? 200 : -200,
  }),
  center: {
    rotate: 0,
    x: 0,
    y: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    rotate: direction < 0 ? 90 : -90,
    x: direction < 0 ? 200 : -200,
    y: direction < 0 ? 200 : -200,
  }),
};

const Lab: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleScroll = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    const delta = e.deltaY;
    setProgress((prev) => {
      const newProgress = prev + delta / window.innerHeight;
      if (newProgress >= 1) {
        setDirection(1);
        setIndex((prevIndex) => (prevIndex + 1) % items.length);
        return 0;
      }
      if (newProgress <= -1) {
        setDirection(-1);
        setIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
        return 0;
      }
      return newProgress;
    });
  }, []);

  const nextIndex = (index + 1) % items.length;
  const prevIndex = (index - 1 + items.length) % items.length;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-hidden bg-off"
      onWheel={handleScroll}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={index}
          className="absolute flex items-center bg-off dark:bg-off-500"
          custom={direction}
          variants={variants}
          initial="center"
          animate="exit"
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          style={{ transformOrigin: "left center" }}
        >
          <img
            src={items[prevIndex].image}
            alt={items[prevIndex].title}
            className="h-[40vh] w-[40vh] object-cover translate-x-[20%] drop-shadow-img dark:drop-shadow-img-white"
          />
          <div className="text-black invert mix-blend-difference translate-x-[-20%] text-end h-[40vh] flex flex-col items-end">
            <div className="text-8xl mt-24">{items[prevIndex].title}</div>
            <div className="text-3xl pr-8">{items[prevIndex].authors}</div>
            <div className="flex-1 flex justify-end items-end">
              <ArrowRight />
            </div>
          </div>
        </motion.div>
        <motion.div
          key={nextIndex}
          className="absolute flex items-center bg-off dark:bg-off-500"
          custom={-direction}
          variants={variants}
          initial="enter"
          animate="center"
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          style={{ transformOrigin: "left center" }}
        >
          <img
            src={items[nextIndex].image}
            alt={items[nextIndex].title}
            className="h-[40vh] w-[40vh] object-cover translate-x-[20%] drop-shadow-img dark:drop-shadow-img-white"
          />
          <div className="text-black invert mix-blend-difference translate-x-[-20%] text-end h-[40vh] flex flex-col items-end">
            <div className="text-8xl mt-24">{items[nextIndex].title}</div>
            <div className="text-3xl pr-8">{items[nextIndex].authors}</div>
            <div className="flex-1 flex justify-end items-end">
              <ArrowRight />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Lab;
