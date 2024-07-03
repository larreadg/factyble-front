import { nextui } from "@nextui-org/react"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        light: {
          background: '#f1f1f1', // Fondo oscuro personalizado
        },
        secondary: {
          DEFAULT: '#063d70'
        },
      },
    },
  },
  lightMode: "class",
  plugins: [nextui()]
}
