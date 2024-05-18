import { atom } from "recoil";
import { TLogo } from "./types/TLogo";

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
