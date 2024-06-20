export function blendColors(
  color1: string,
  color2: string,
  opacity1: number,
  opacity2: number
): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const r = Math.round(
    (rgb1.r * opacity1 + rgb2.r * opacity2) / (opacity1 + opacity2)
  );
  const g = Math.round(
    (rgb1.g * opacity1 + rgb2.g * opacity2) / (opacity1 + opacity2)
  );
  const b = Math.round(
    (rgb1.b * opacity1 + rgb2.b * opacity2) / (opacity1 + opacity2)
  );

  return rgbToHex(r, g, b);
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

export function componentToHex(c: number): string {
  const hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

export const getComputedBackgroundColor = (className: string) => {
  const tempElement = document.createElement("div");
  tempElement.className = className;
  document.body.appendChild(tempElement);
  const style = getComputedStyle(tempElement);
  const backgroundColor = style.backgroundColor;
  document.body.removeChild(tempElement);
  return backgroundColor;
};
