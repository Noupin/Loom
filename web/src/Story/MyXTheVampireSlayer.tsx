import { useSetRecoilState } from "recoil";
import { logoState } from "../State";
import { useEffect, useState } from "react";
import { TLogo } from "../types/TLogo";
import { useAnimateColor } from "../hook/animateColor";

export default function MyXTheVampireSlayer() {
  const setLogoType = useSetRecoilState(logoState);
  const [bgColor, setBgColor] = useState("#E9ECF2");

  useEffect(() => {
    setLogoType(TLogo.LightLogo);
  }, []);

  useAnimateColor("#CC3333", "#172554", setBgColor, true, 0.5);

  return (
    <main
      className="flex flex-row w-full h-full transition-colors text-white"
      style={{
        backgroundColor: bgColor,
      }}
    >
      <div className="flex-1"></div>
      <div className="flex-[7] bg-white bg-opacity-5 rounded-lg m-5 px-5 py-4">
        <div className="flex justify-center items-center w-full h-full">
          <div>Vampire hunters coming soon..</div>
        </div>
      </div>
      <div className="flex-1"></div>
    </main>
  );
}
