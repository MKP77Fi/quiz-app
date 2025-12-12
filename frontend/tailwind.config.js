/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Määritellään värit vanilla-CSS:si mukaan
      colors: {
        background: '#1A1A1A',       // Tumma tausta
        surface: '#1E1E1E',          // Paneelien tausta
        primary: '#F2F2F2',          // Pääteksti
        'accent-orange': '#FF5733',  // Tehosteväri 1
        'accent-turquoise': '#1CB1CF', // Tehosteväri 2
        'border-subtle': 'rgba(242, 242, 242, 0.1)', // Himmeät reunat
      },
      // Määritellään fontit
      fontFamily: {
        sans: ['Barlow', 'sans-serif'],
        display: ['"Racing Sans One"', 'cursive'],
      },
      // Voidaan määritellä myös varjot
      boxShadow: {
        soft: '0 2px 8px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}