import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "#0B0C10",
        gunmetal: "#1F2833",
        teal: "#14FFEC",
        steel: "#C5C6C7",
        aqua: "#66FCF1",
        cyan: "#45A29E",
      },
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        share: ["Share Tech Mono", "monospace"],
      },
      boxShadow: {
        neon: "0 0 15px rgba(20, 255, 236, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
