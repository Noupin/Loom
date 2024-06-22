import { useSetRecoilState } from "recoil";
import { logoState } from "../State";
import { useEffect, useState } from "react";
import { TLogo } from "../types/TLogo";
import { useAnimateColor } from "../hook/animateColor";
import { TypewriterEffect } from "../component/TypeWriterEffect";

const words = [
  { text: "Coming" },
  { text: "not" },
  { text: "that" },
  { text: "soon" },
  { text: ":)", className: "text-blue-300 dark:text-blue-300" },
];

export default function AndroidTragedy() {
  const setLogoType = useSetRecoilState(logoState);
  const [bgColor, setBgColor] = useState("#E9ECF2");

  useEffect(() => {
    setLogoType(TLogo.LightLogo);
  }, []);

  useAnimateColor("#022c22", "#172554", setBgColor, true, 0.5);

  return (
    <main
      className="flex flex-col w-full h-full transition-colors text-white"
      style={{
        backgroundColor: bgColor,
      }}
    >
      <div className="flex-1"></div>
      <div className="flex-[7] bg-white bg-opacity-5 rounded-lg m-5 px-5 py-4">
        <div className="flex flex-col justify-center items-center w-full h-full">
          <TypewriterEffect words={words} cursorClassName="bg-blue-300" />
          <p className="mt-5">
            (I mean I wanna write and make a game first AND write this story so)
          </p>
        </div>
      </div>
      <div className="flex-1"></div>
    </main>
  );
}
