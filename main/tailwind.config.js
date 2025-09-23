import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
        play: ["var(--font-play)"]
      },
    },
  },
  darkMode: "class",
  plugins: [heroui({
    themes: {
        dark: {
          colors: {
            background: {
              DEFAULT: "#FF6900",
              50: "#a54500da"},
            foreground: "#141616",
            cumground: "rgba(0, 0, 0, 0.37)",
            nothinground:"rgba(0, 0, 0, 0.31)",
            nothingrounder:"rgba(0, 0, 0, 0.07)",
            nothing:"rgba(0, 0, 0, 0)",
            red: "#ff0000ff",
            green:"#48ff00ff",
            white: "#ffffffff",
            
            black: {DEFAULT: "#000000",
              50: "rgba(0, 0, 0, 0.31)"
            },
            primary:{
              DEFAULT: "#FF6900"
            },
            
            
          },
        },
        light: {
          colors: {
            background: {
              DEFAULT: "#FF6900",
              50: "#a54500da"},
            foreground: "#ffffffb0",
            cumground: "rgba(255, 255, 255, 0.37)",
            nothinground:"rgba(255, 255, 255, 0.31)",
            nothingrounder:"rgba(255, 255, 255, 0.07)",
            nothing:"rgba(0, 0, 0, 0)",
            red: "#ff0000ff",
            green:"#48ff00ff",
            white: "#000000",
            
            black: {DEFAULT: "#ffffffff",
              50: "#e0e0e0ff"
            },
            primary:{
              DEFAULT: "#FF6900"
            },
            
            
          },
        },
      },
  })],
     
}

module.exports = config;