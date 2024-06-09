import { atom } from "recoil";
import { TLogo } from "./types/TLogo";
import { TScreenSize } from "./types/TScreenSize";

export const logoState = atom<TLogo>({
  key: "logoState",
  default: TLogo.Logo,
});

export const tempLogoState = atom<TLogo>({
  key: "tempLogoState",
  default: TLogo.LightLogo,
});

export const logoCustomColorState = atom({
  key: "logoCustomColorState",
  default: "#E9ECF2",
});

export const darkModeState = atom({
  key: "darkModeState",
  default: false,
});

export const leftHandModeState = atom({
  key: "leftHandModeState",
  default: false,
});

export const deviceScreenSizeState = atom<TScreenSize>({
  key: "deviceScreenSize",
  default: TScreenSize.ExtraLarge,
});

export const logoDimensionState = atom({
  key: "logoDimensionsState",
  default: 50,
});
