/** @type {import('tailwindcss').Config} */
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        off: {
          DEFAULT: "#E9ECF2",
          0: "#E9ECF2",
          50: "#DFE2EC",
          100: "#C2C8DB",
          200: "#838FB4",
          300: "#505E86",
          400: "#2A3146",
          500: "#06070A",
        },
      },
      scale: {
        flip: "-1, 1",
      },
      dropShadow: {
        img: "8px 8px 16px rgba(0, 0, 0, 0.25)",
        "img-white": "8px 8px 16px rgba(255, 255, 255, 0.175)",
        "img-mobile": "0px 8px 16px rgba(0, 0, 0, 0.25)",
        "img-white-mobile": "0px 8px 16px rgba(255, 255, 255, 0.175)",
      },
    },
    fontFamily: {
      barcode: ["'Libre Barcode 128 Text'"],
      lateef: ["'Lateef'"],
      ebGaramond: ["'EB Garamond'"],
      cormorant: ["'Cormorant'"],
    },
    animation: {
      aurora: "aurora 60s linear infinite",
      spotlight: "spotlight 2s ease .75s 1 forwards",
      pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;",
      exaggeratedPulse:
        "exaggeratedPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;",
    },
    keyframes: {
      aurora: {
        from: {
          backgroundPosition: "50% 50%, 50% 50%",
        },
        to: {
          backgroundPosition: "350% 50%, 350% 50%",
        },
      },
      spotlight: {
        "0%": {
          opacity: 0,
          transform: "translate(-72%, -62%) scale(0.5)",
        },
        "100%": {
          opacity: 1,
          transform: "translate(-50%,-40%) scale(1)",
        },
      },
      pulse: {
        "0%, 100%": {
          opacity: 1,
        },
        "50%": {
          opacity: 0.5,
        },
      },
      exaggeratedPulse: {
        "0%, 100%": {
          opacity: 1,
        },
        "50%": {
          opacity: 0.25,
        },
      },
    },
  },
  plugins: ["tailwindcss-animate", addVariablesForColors],
};

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
