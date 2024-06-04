import React from "react";
import { Search } from "lucide-react";

interface LandingNavigationProps {
  expandSearch: boolean;
  setExpandSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

const LandingNavigation: React.FC<LandingNavigationProps> = ({
  expandSearch,
  setExpandSearch,
}) => (
  <div className="h-[50px] flex mt-[25px] mx-[25px] items-center relative z-[1]">
    <div className="flex-1" />
    <div className="flex-[2] flex text-center text-2xl">
      <div className="flex-1">Textiles</div>
      <div className="flex-1">Genres</div>
      <div className="flex-1">Platform</div>
    </div>
    {expandSearch ? (
      <div
        className="flex flex-[2] ml-5 justify-end"
        onMouseLeave={() => setExpandSearch(false)}
        autoFocus={true}
      >
        <div
          className="flex px-3 py-2 bg-black bg-opacity-25 rounded-full transition-[width]"
          style={{
            width: expandSearch ? "75%" : "25px",
            transitionDuration: "500ms",
          }}
        >
          <Search transform="scale(-1, 1)" />
          <input
            type="text"
            className="flex-1 ml-1 placeholder-black placeholder-opacity-50 bg-transparent border-none outline-none"
            placeholder="Search..."
          />
        </div>
      </div>
    ) : (
      <div className="flex flex-1 justify-end">
        <Search onMouseEnter={() => setExpandSearch(true)} />
      </div>
    )}
  </div>
);

export default LandingNavigation;
