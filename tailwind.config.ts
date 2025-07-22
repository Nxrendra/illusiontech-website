import type { Config } from "tailwindcss";
const { fontFamily } = require("tailwindcss/defaultTheme");


const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", ...fontFamily.sans],
      },
      colors: {
         background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        accent: '#3B82F6', // softBlue
        'accent-hover': '#2563EB', // a slightly darker blue for hover
        softWhite: '#F9FAFB',
        darkAccent: '#1E293B',
        greyLight: '#9CA3AF',
      },
      keyframes: {
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.5s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards 0.3s',
      }
    },
  },
  plugins: [],
};
export default config;