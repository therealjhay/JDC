import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        accent: {
          50: '#fef7ee',
          100: '#fdedd4',
          200: '#fad5a5',
          300: '#f7b96e',
          400: '#f39431',
          500: '#f0710b',
          600: '#e15706',
          700: '#ba410a',
          800: '#94340f',
          900: '#782c0f',
          950: '#431405',
        },
      },
    },
  },
  plugins: [],
};
export default config;
