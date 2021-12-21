module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    borderRadius: {
      none: "0",
      sm: "0.125rem",
      md: "0.375rem",
      lg: "0.5rem",
      full: "9999px",
      xl: "16px",
      "3xl": "1.5rem",
    },
    extend: {
      colors: {
        'orange-peel': '#FF9F1C',
        'mellow-apricot': '#FEC77E',
        'light-cyan': '#CBF3F0',
        'tiffany-blue': '#1C7CFF',
      },
      gridTemplateColumns: {
        '20': 'repeat(1, 1fr 2fr)',
      },
      backgroundImage: {
        'home-bg': "url('/src/assets/backdrop.jpg')",
      },
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
    },
  },
  plugins: [],
};
