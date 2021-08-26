const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'jit',
  purge: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: false,
  theme: {
    colors: {
      white: '#ffffff',
      black: '#000000',
      transparent: 'transparent',

      background: '#EFF6FF',

      gray2: '#FAFCFE',
      gray3: '#F4F7FC',
      gray4: '#EFF2F5',
      gray5: '#EDEDED',
      gray6: '#EAEDF7',
      gray7: '#ECEFF8',
      gray10: '##232323',

      purple0: '#b7bed8',
      purple1: '#97A0C3',
      purple2: '#636E95',
      purple3: '#424A64',

      green1: '#1FD0A3',
      green2: '#04B78A',

      blue0: '#d6e1ff',
      blue1: '#2962FC',
      blue2: '#1f4cc5',
      blue3: '#242F57',
      blue4: '#0c2052',

      red2: '#ff5151',
      red3: '#ea2626',
    },
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        montserrat: ['Montserrat'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
