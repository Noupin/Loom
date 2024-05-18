// First Party Imports
import logo from "../assets/logo.svg";
import lightLogo from "../assets/lightLogo.svg";
import darkLogo from "../assets/darkLogo.svg";
import { TLogo } from "../types/TLogo";
import { fetchSVG, replaceSVGColor, svgToDataURL } from "./svg";

export async function getLogo(logoType: TLogo, color: string = "#000000") {
  switch (logoType) {
    case TLogo.Logo:
      return logo;
    case TLogo.DarkLogo:
      return darkLogo;
    case TLogo.LightLogo:
      return lightLogo;
    case TLogo.CustomLogo:
      const svgContent = await fetchSVG(lightLogo);
      const coloredSVG = replaceSVGColor(svgContent, color);
      return svgToDataURL(coloredSVG);
    default:
      return lightLogo;
  }
}

export function getTempLogo(logoType: TLogo) {
  switch (logoType) {
    case TLogo.Logo:
      return logo;
    case TLogo.DarkLogo:
      return darkLogo;
    case TLogo.LightLogo:
      return lightLogo;
    default:
      return lightLogo;
  }
}
