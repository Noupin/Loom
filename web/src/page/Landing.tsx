import { useSetRecoilState } from "recoil";
import { logoState } from "../State";
import { useEffect, useState } from "react";
import { TLogo } from "../types/TLogo";
import { Search } from "lucide-react";

function Landing() {
  const setLogoType = useSetRecoilState(logoState);
  const [expandSearch, setExpandSearch] = useState(true);

  useEffect(() => {
    setLogoType(TLogo.Logo);
  }, []);

  return (
    <main className="flex flex-col w-full h-full bg-off text-invert">
      {/* Matches the logo dimensions */}
      <div className="h-[50px] flex mt-[25px] mx-[25px] items-center">
        <div className="flex-1" />

        <div className="flex-[2] flex text-center">
          <div className="flex-1">Textiles</div>
          <div className="flex-1">Genres</div>
          <div className="flex-1">Platform</div>
        </div>

        {expandSearch ? (
          <div className="flex flex-[2] ml-5 px-3 py-2 bg-black bg-opacity-25 rounded-full">
            <Search transform="scale(-1, 1)" />
            <input
              type="text"
              className="flex-1 ml-1 placeholder-black placeholder-opacity-50 bg-transparent border-none outline-none"
              placeholder="Search..."
            />
          </div>
        ) : (
          <div className="flex flex-1 justify-end">
            <Search />
          </div>
        )}
      </div>

      <div className="flex-1 justify-center items-center p-5 flex">
        <img
          src="https://cdn3.vox-cdn.com/thumbor/eKbukOC7ZHVXSxbUR2sH-NfwoOw=/0x1080/volume-assets.voxmedia.com/production/56997d157bef3ac54865f47e5106dfcd/rogueone.jpg"
          alt="Rogue One"
          className="h-[40vh] w-[40vh] object-cover translate-x-[20%]"
        />
        <div className="invert mix-blend-difference translate-x-[-20%] text-end mb-10">
          <div className="text-6xl">Android Tragedy</div>
          <div className="text-lg pr-8 mt-3">Jane Doe & Mary Sue</div>
        </div>
      </div>

      <div className="flex justify-between p-5">
        <div className="flex">Frv-01</div>
        <div className="flex font-barcode text-2xl">No1 27May2024</div>
      </div>
    </main>
  );
}

export default Landing;
