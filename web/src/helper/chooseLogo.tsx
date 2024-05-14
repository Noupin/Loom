// First Party Imports
import logo from "../assets/logo.svg";
import lightLogo from "../assets/lightLogo.svg";
import darkLogo from "../assets/darkLogo.svg";
import { TLogo } from "../types/TLogo";

export function getLogo(logoType: TLogo) {
  switch (logoType) {
    case TLogo.Logo:
      return logo;
    case TLogo.DarkLogo:
      return darkLogo;
    case TLogo.LightLogo:
      return lightLogo;
  }
}
