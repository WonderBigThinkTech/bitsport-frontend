/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#000000",
          100: "#232323",
          150: "#707070",
          200: "#191C25",
          300: "#2B7AF6",
          400: "#191C25",
          450: "#9B9CA3",
          500: "#838588",
          550: "#373B3F",
          600: "#374151",
          650: "#9CA3AF",
          700: "#777786",
          750: "#C6C6C6",
          800: "#24242C",
          850: "#28282D",
          900: "#E5E5E5",
          950: "#47474F",
          1000: "#39393F",
          1050: "#1F2027",
          1100: "#909093",
          1150: "#B9B9B9",
          1200: "#20222D",
        },
        secondary: {
          50: "#BD2344",
          100: "#F92552",
          150: "#D41105",
          200: "#BABABA",
          250: "#D3274C",
          300: "#D0AA2C",
          350: "#67A707",
          400: "#1E2126",
          450: "#265793",
        },
      },
      fontFamily: {
        Poppins: ["Poppins"],
        Rajdhani: ["Rajdhani"],
      },
      width: {
        modal: "550px",
        table: "87%",
      },
      minHeight: {
        "90vh": "90vh",
        "30vh": "30vh",
      },
      maxHeight: {
        "90vh": "90vh",
        modal: "75vh",
      },
    },
  },
  plugins: [],
};
