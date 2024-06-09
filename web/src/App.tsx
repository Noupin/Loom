//Third Party Imports
import "typeface-lateef";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

// Pages
import Landing from "./page/Landing";
import StoryTemplate from "./page/StoryTemplate";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  darkModeState,
  deviceScreenSizeState,
  logoCustomColorState,
  logoDimensionState,
  logoState,
  tempLogoState,
} from "./State";
import { getLogo, getTempLogo } from "./helper/chooseLogo";
import { useEffect, useState } from "react";
import MyXTheVampireSlayer from "./Story/MyXTheVampireSlayer";
import { useWindowSize } from "./hook/windowSize";
import { TScreenSize } from "./types/TScreenSize";
import AndroidTragedy from "./Story/AndroidTragedy";

export default function App() {
  const logoType = useRecoilValue(logoState);
  const tempLogoType = useRecoilValue(tempLogoState);
  const logoCustomColor = useRecoilValue(logoCustomColorState);
  const darkMode = useRecoilValue(darkModeState);
  const setDeviceScreenSize = useSetRecoilState(deviceScreenSizeState);
  const windowSize = useWindowSize();
  const [logoDimension, setLogoDimension] = useRecoilState(logoDimensionState);

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

  useEffect(() => {
    if (windowSize.width < 768) {
      setDeviceScreenSize(TScreenSize.Small);
      setLogoDimension(36);
    } else if (windowSize.width < 1024) {
      setDeviceScreenSize(TScreenSize.Medium);
      setLogoDimension(50);
    } else if (windowSize.width < 1280) {
      setDeviceScreenSize(TScreenSize.Large);
      setLogoDimension(50);
    } else {
      setDeviceScreenSize(TScreenSize.ExtraLarge);
      setLogoDimension(50);
    }
  }, [windowSize]);

  return (
    <BrowserRouter>
      <Link to="/">
        <img
          src={logoSrc || getTempLogo(tempLogoType)}
          alt="Logo"
          height={logoDimension}
          width={logoDimension}
          className="absolute top-[25px] left-[25px] cursor-pointer"
        />
      </Link>

      <Routes>
        <Route path="/" element={<Landing />} />

        <Route
          path="/my-x-the-vampire-slayer"
          element={
            <StoryTemplate>
              <MyXTheVampireSlayer />
            </StoryTemplate>
          }
        />
        <Route
          path="/android-tragedy"
          element={
            <StoryTemplate>
              <AndroidTragedy />
            </StoryTemplate>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
