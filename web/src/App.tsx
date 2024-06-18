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
  leftHandModeState,
  logoCustomColorState,
  logoDimensionState,
  logoState,
  tempLogoState,
} from "./State";
import { getLogo, getTempLogo } from "./helper/chooseLogo";
import { useEffect, useRef, useState } from "react";
import MyXTheVampireSlayer from "./Story/MyXTheVampireSlayer";
import { useWindowSize } from "./hook/windowSize";
import { TScreenSize } from "./types/TScreenSize";
import AndroidTragedy from "./Story/AndroidTragedy";

const getComputedBackgroundColor = (className: string) => {
  const tempElement = document.createElement("div");
  tempElement.className = className;
  document.body.appendChild(tempElement);
  const style = getComputedStyle(tempElement);
  const backgroundColor = style.backgroundColor;
  document.body.removeChild(tempElement);
  return backgroundColor;
};

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
      return;
    }

    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    localStorage.setItem("leftHandMode", JSON.stringify(leftHandMode));
  }, [darkMode, leftHandMode]);

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
          className="absolute top-[25px] left-[25px] cursor-pointer"
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
