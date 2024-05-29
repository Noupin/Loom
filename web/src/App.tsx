//Third Party Imports
import "typeface-lateef";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

// Pages
import Landing from "./page/Landing";
import StoryTemplate from "./page/StoryTemplate";
import ExampleStory from "./page/ExampleStory";
import { useRecoilValue } from "recoil";
import {
  darkModeState,
  leftHandModeState,
  logoCustomColorState,
  logoState,
  tempLogoState,
} from "./State";
import { getLogo, getTempLogo } from "./helper/chooseLogo";
import { useEffect, useState } from "react";
import Lab from "./page/Lab";

export default function App() {
  const logoType = useRecoilValue(logoState);
  const tempLogoType = useRecoilValue(tempLogoState);
  const logoCustomColor = useRecoilValue(logoCustomColorState);
  const darkMode = useRecoilValue(darkModeState);

  const [logoSrc, setLogoSrc] = useState("");

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

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
          src={logoSrc || getTempLogo(tempLogoType)}
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

        <Route path="/lab" element={<Lab />} />
      </Routes>
    </BrowserRouter>
  );
}
