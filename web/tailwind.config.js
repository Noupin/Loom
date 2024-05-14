/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        offWhite: "#E9ECF2",
      },
    },
  },
  plugins: ["tailwindcss-animate"],
};
