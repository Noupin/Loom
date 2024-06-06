/** @type {import('tailwindcss').Config} */

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
      },
    },
    fontFamily: {
      barcode: ["'Libre Barcode 128 Text'"],
      lateef: ["'Lateef'"],
    },
  },
  plugins: ["tailwindcss-animate"],
};
