/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat_400Regular", "sans-serif"],
        "montserrat-bold": ["Montserrat_700Bold", "sans-serif"],
      },
      colors: {
        lightPrimary: "#FFA840",
        darkPrimary: "#ED8718",
        secondary: "#0F2535",
        ctaSecondary: "#EBEBEB",
        ctaSecondaryActive: "#D9D9D9",
      },
    },
  },
  plugins: [],
};
