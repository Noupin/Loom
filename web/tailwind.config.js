/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
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
    },
  },
  plugins: ["tailwindcss-animate"],
};
