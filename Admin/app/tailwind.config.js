module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        quicksand: ['Quicksand', 'sans-serif'],
      },
      colors: {
        pageBg: '#F4F7FE',
        primary: '#260D94',
        secondary: '#0180FF',
        tertiary: '#646464',
        lightGray: '#EFEDED',
        icons: '#999999',
      },
      fontWeight: {
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      }
    },
  },
  plugins: [],
  darkMode: "class",
};
