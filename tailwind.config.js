/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic mappings
        primary: "hsl(var(--primary) / <alpha-value>)",
        accent: "hsl(var(--accent) / <alpha-value>)",
        secondary: "hsl(var(--secondary) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        surface: "hsl(var(--surface) / <alpha-value>)",

        // Literal palette (for specific uses if needed)
        coral: "#E58C84",
        "dusty-rose": "#C17480",
        "muted-plum": "#8F5774",
        "deep-purple": "#563169",
        "violet-navy": "#2C1C51",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'clean': '0 1px 3px 0 rgb(44 28 81 / 0.1), 0 1px 2px -1px rgb(44 28 81 / 0.1)', // Violet-Navy based shadow
        'clean-lg': '0 10px 15px -3px rgb(44 28 81 / 0.1), 0 4px 6px -4px rgb(44 28 81 / 0.1)',
      }
    },
  },
  plugins: [],
}
