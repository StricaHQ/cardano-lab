/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#013396",
        },
        secondary: {
          DEFAULT: "#1242B7",
        },
        textColor: {
          DEFAULT: "#00000",
          1: "#404040",
          2: "#808080",
        },
        cardBackgroundColor: {
          DEFAULT: "#FBFBFB",
        },
        borderColor: {
          DEFAULT: "#C9C9C9",
        },
        inputField: {
          DEFAULT: "#FBFCFF",
        },
      },
      fontFamily: {
        Poppins: [
          "Poppins",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        LabMono: ["Recursive", "monospace"],
      },
    },

    plugins: [],
  },
};
