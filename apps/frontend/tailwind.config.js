const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'jit',
  purge: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: false,
  theme: {
    colors: {
      transparent: 'transparent',
      white: '#ffffff',
      black: '#000000',
      light: '#F9FAFF',
      gray: '#E3E5E8',
      bordergray: '#EBEBEE',
      darkgray: '#757784',
      background: '#F9FAFF',
      dark: '#141414',
      lime: '#CEF33C',
      lightlime: '#F5FDD8',
      evergreen: '#00565B',
      rust: '#4E5B00',
      lightgray: '#ECEDEF',
      purple: '#6600E8',
      green: '#5aa100',
      red: '#D0291E',
    },
    extend: {
      fontFamily: {
        poppins: ['Poppins', ...defaultTheme.fontFamily.sans],
        manrope: ['Manrope', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
