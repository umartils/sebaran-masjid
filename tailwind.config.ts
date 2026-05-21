import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#f6a313",
          dark: "#d88906",
        },
        ink: "#14213d",
        muted: "#64748b",
        line: "#dbe3ed",
        surface: "#ffffff",
        soft: "#f5f8fb",
        danger: "#f04438",
        warning: "#d97706",
        success: "#15803d",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "sans-serif",
        ],
      },
      screens: {
        md: "901px",
      },
    },
  },
  plugins: [],
};

export default config;
