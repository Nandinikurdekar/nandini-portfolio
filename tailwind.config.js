/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f4f1ea",
        ink: "#1e211f",
        muted: "#6c706b",
        line: "#d9d5cc",
        accent: "#52748a",
        accentSoft: "#dbe6eb",
        sage: "#748a72",
        warm: "#b7834c"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Georgia", "ui-serif", "serif"]
      }
    }
  },
  plugins: []
}
