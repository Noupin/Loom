import { useSetRecoilState } from "recoil";
import { logoState } from "../State";
import { useEffect } from "react";
import { TLogo } from "../types/TLogo";

function Landing() {
  const setLogoType = useSetRecoilState(logoState);

  useEffect(() => {
    setLogoType(TLogo.Logo);
  }, []);

  return (
    <main className="flex flex-row w-full h-full bg-offWhite text-gray-800">
      <div className="flex-1"></div>
      <div className="flex-[7] bg-black bg-opacity-5 rounded-lg m-5 px-5 py-4">
        <div className="flex justify-between w-full h-full">
          <div>Loom is...</div>
          <div className="flex justify-end items-end">...in progress</div>
        </div>
      </div>
      <div className="flex-1"></div>
    </main>
  );
}

export default Landing;
