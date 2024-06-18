import { useSetRecoilState } from "recoil";
import { logoState } from "../State";
import { useEffect } from "react";
import { TLogo } from "../types/TLogo";
import { TypewriterEffect } from "../component/TypeWriterEffect";

const words = [
  {
    text: "Vampire",
  },
  {
    text: "hunters",
  },
  {
    text: "coming",
  },
  {
    text: "soon",
  },
  {
    text: "...",
    className: "text-red-600 dark:text-red-600",
  },
];

export default function MyXTheVampireSlayer() {
  const setLogoType = useSetRecoilState(logoState);

  useEffect(() => {
    setLogoType(TLogo.LightLogo);
  }, []);

  return (
    <main className="flex flex-col w-full h-full transition-colors text-white bg-off-500">
      <div className="flex-1"></div>
      <div className="flex-[7] bg-white bg-opacity-5 rounded-lg m-5 px-5 py-4">
        <div className="flex flex-col justify-center items-center w-full h-full">
          <TypewriterEffect
            words={words}
            className="text-off"
            cursorClassName="bg-red-600"
            textSpeed={0.06}
          />
        </div>
      </div>
      <div className="flex-1"></div>
    </main>
  );
}
