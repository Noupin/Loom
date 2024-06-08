import { useSetRecoilState } from "recoil";
import { logoCustomColorState, logoState } from "../State";
import { useEffect, useState } from "react";
import { TLogo } from "../types/TLogo";
import { useAnimateColor } from "../hook/animateColor";

export default function MyXTheVampireSlayer() {
  const setLogoType = useSetRecoilState(logoState);
  const setLogoCustomColor = useSetRecoilState(logoCustomColorState);
  const [bgColor, setBgColor] = useState("#E9ECF2");
  const [textColor, setTextColor] = useState("#06070A");

  useEffect(() => {
    setLogoType(TLogo.CustomLogo);
  }, []);

  useAnimateColor("#E9ECF2", "#06070A", setLogoCustomColor, true, 0.5);
  useAnimateColor("#06070A", "#E9ECF2", setBgColor, true, 0.5);
  useAnimateColor("#E9ECF2", "#06070A", setTextColor, true, 0.5);

  return (
    <main
      className="flex flex-row w-full h-full transition-colors"
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      <div className="flex-1"></div>
      <div className="flex-[7] bg-white bg-opacity-5 rounded-lg m-5 px-5 py-4">
        <div className="flex justify-between items-center w-full h-full">
          <div>I AM</div>

          <div className="flex justify-end"> THE STORY</div>
        </div>
      </div>
      <div className="flex-1"></div>
    </main>
  );
}
