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
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
        clash: ["var(--font-clash-display)"],
        telma: ["var(--font-telma)"],
        cabinet: ["var(--font-cabinet)", "sans-serif"],
      },
      colors: {
        'dark-bg': '#1F2937',
        'content1': '#111727'
      }
    },
  },
  darkMode: "class",
  plugins: [heroui()],
}

module.exports = config;