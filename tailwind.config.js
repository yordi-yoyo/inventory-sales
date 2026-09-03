import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
  content: [
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './storage/framework/views/*.php',
    './resources/views/**/*.blade.php',
    './resources/js/**/*.jsx',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F5F4EF',
        ink: '#1D2521',
        ledger: {
          DEFAULT: '#2F5D4E',
          dark: '#234840',
        },
        brass: '#B98A2E',
        brick: '#A23B2E',
        moss: '#4C7A52',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};