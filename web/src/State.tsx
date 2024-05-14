import { atom } from "recoil";
import { TLogo } from "./types/TLogo";

export const logoState = atom<TLogo>({
  key: "logoType",
  default: TLogo.Logo,
});
