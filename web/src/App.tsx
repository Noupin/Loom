//Third Party Imports
import "typeface-lateef";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import Landing from "./page/Landing";
import StoryTemplate from "./page/StoryTemplate";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  darkModeState,
  deviceScreenSizeState,
  leftHandModeState,
  logoCustomColorState,
  logoDimensionState,
  logoState,
  tempLogoState,
  wpmState,
} from "./State";
import { getLogo, getTempLogo } from "./helper/chooseLogo";
import { useEffect, useRef, useState } from "react";
import MyXTheVampireSlayer from "./Story/MyXTheVampireSlayer";
import { useWindowSize } from "./hook/windowSize";
import { TScreenSize } from "./types/TScreenSize";
import AndroidTragedy from "./Story/AndroidTragedy";
import { getComputedBackgroundColor } from "./helper/color";

export default function App() {
  const logoType = useRecoilValue(logoState);
  const tempLogoType = useRecoilValue(tempLogoState);
  const logoCustomColor = useRecoilValue(logoCustomColorState);
  const [darkMode, setDarkMode] = useRecoilState(darkModeState);
  const setDeviceScreenSize = useSetRecoilState(deviceScreenSizeState);
  const windowSize = useWindowSize();
  const [leftHandMode, setLeftHandMode] = useRecoilState(leftHandModeState);
  const [logoDimension, setLogoDimension] = useRecoilState(logoDimensionState);
  const initialPageLoadRef = useRef(true);
  const [wpm, setWpm] = useRecoilState(wpmState);

  const [logoSrc, setLogoSrc] = useState("");

  useEffect(() => {
    if (initialPageLoadRef.current) {
      initialPageLoadRef.current = false;

      const storedDarkMode = localStorage.getItem("darkMode");
      if (storedDarkMode) {
        const parsedDarkMode = JSON.parse(storedDarkMode);
        setDarkMode(parsedDarkMode);
      }
      const storedLeftHandMode = localStorage.getItem("leftHandMode");
      if (storedLeftHandMode) {
        const parsedLeftHandMode = JSON.parse(storedLeftHandMode);
        setLeftHandMode(parsedLeftHandMode);
      }
      const storedWpm = localStorage.getItem("wpm");
      if (storedWpm) {
        const parsedWpm = JSON.parse(storedWpm);
        setWpm(parsedWpm);
      }
      return;
    }

    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    localStorage.setItem("leftHandMode", JSON.stringify(leftHandMode));
    localStorage.setItem("wpm", JSON.stringify(wpm));
  }, [darkMode, leftHandMode, wpm]);

  useEffect(() => {
    const themeColorMeta = document.getElementById("theme-color-meta");

    if (darkMode) {
      document.body.classList.add("dark");
      themeColorMeta?.setAttribute(
        "content",
        getComputedBackgroundColor("bg-off-500")
      );
    } else {
      document.body.classList.remove("dark");
      themeColorMeta?.setAttribute(
        "content",
        getComputedBackgroundColor("bg-off")
      );
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
          className="absolute cursor-pointer z-[1]"
          style={{
            top: logoDimension / 2,
            left: logoDimension / 2,
          }}
        />
      </Link>

      <Routes>
        <Route path="/" element={<Landing />} />

        <Route
          path="/my-x-the-vampire-slayer"
          element={
            <StoryTemplate allowDarkMode={false} useLightColorControls={true}>
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
