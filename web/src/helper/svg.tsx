// Function to fetch the SVG content as a string
export const fetchSVG = async (url: string) => {
  const response = await fetch(url);
  const text = await response.text();
  return text;
};

// Function to replace the stroke color in the SVG string
export const replaceSVGColor = (svgString: string, color: string) => {
  return svgString.replace(/stroke="[^"]*"/g, `stroke="${color}"`);
};

// Function to convert SVG string to data URL
export const svgToDataURL = (svgString: string) => {
  return `data:image/svg+xml;base64,${btoa(svgString)}`;
};
