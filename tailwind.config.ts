import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#641311',
        'secondary': '#cc936b',
        'light': '#FFFFFF',
      },
      fontFamily: {
        moondance: ['Moon Dance', 'sans-serif'], // Adiciona a fonte ao Tailwind
        poppins: ['Poppins', 'sans-serif'],
      },
      animation: {
        slideDown: 'slideDown 0.3s ease-in-out',
      },
      keyframes: {
        slideDown: {
          '0%': { transform: 'translateY(-10%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;