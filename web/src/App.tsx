//Third Party Imports
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

// Pages
import Landing from "./page/Landing";
import StoryTemplate from "./page/StoryTemplate";
import ExampleStory from "./page/ExampleStory";
import { useRecoilValue } from "recoil";
import { logoCustomColorState, logoState } from "./State";
import { getLogo } from "./helper/chooseLogo";
import { useEffect, useState } from "react";

export default function App() {
  const logoType = useRecoilValue(logoState);
  const logoCustomColor = useRecoilValue(logoCustomColorState);

  const [logoSrc, setLogoSrc] = useState("");

  useEffect(() => {
    const fetchLogo = async () => {
      const src = await getLogo(logoType, logoCustomColor);
      setLogoSrc(src);
    };
    fetchLogo();
  }, [logoType, logoCustomColor]);

  return (
    <BrowserRouter>
      <Link to="/">
        <img
          src={logoSrc}
          alt="Logo"
          height={50}
          width={50}
          className="absolute top-[25px] left-[25px] cursor-pointer"
        />
      </Link>

      <Routes>
        <Route path="/" element={<Landing />} />

        <Route
          path="/TestStory"
          element={
            <StoryTemplate>
              <ExampleStory />
            </StoryTemplate>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
