export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        slideDown: {
          "0%": { transform: "translateY(-100%)" },
          "50%": { transform: "translateY(-20%)" },
          "80%": { transform: "translateY(-5%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        "slide-down": "slideDown 0.3s ease-out forwards",
      },
    },
  },
  variants: {},
  plugins: [],
};

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  // darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        // primary_color: "#01008A",
        primary_color: "#00008af0",
        light_primary: "#7676DC",
        elight_primary: "#E8E8FF",
        form_base: "#00A189",
        para: "#707070",
        dark: "#000000",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
