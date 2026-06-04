/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./templates/**/*.html",
    "./src/**/*.rs"
  ],
  theme: {
    extend: {
      colors: {
        "on-primary-fixed-variant": "#00485a",
        "surface-bright": "#2b2c32",
        "secondary-fixed-dim": "#ffacc4",
        "on-tertiary-fixed-variant": "#0027a3",
        "on-error-container": "#ffb2b9",
        "surface-container-highest": "#25252b",
        "outline": "#76757a",
        "tertiary-fixed": "#9dacff",
        "surface-container": "#19191e",
        "secondary-dim": "#ff6a9f",
        "surface": "#0e0e12",
        "tertiary-fixed-dim": "#8a9dff",
        "on-primary-container": "#002732",
        "inverse-surface": "#fbf8fe",
        "on-surface-variant": "#acaaaf",
        "on-tertiary-container": "#ffffff",
        "tertiary": "#8397ff",
        "on-secondary-fixed": "#6c0035",
        "on-secondary-fixed-variant": "#a00052",
        "on-surface": "#f8f5fb",
        "on-primary": "#003e4e",
        "on-tertiary": "#001564",
        "surface-container-lowest": "#000000",
        "primary": "#4dc9f1",
        "surface-container-low": "#131317",
        "error": "#ff6e84",
        "error-dim": "#d73357",
        "on-primary-fixed": "#002732",
        "on-tertiary-fixed": "#000e50",
        "error-container": "#a70138",
        "outline-variant": "#48474c",
        "surface-dim": "#0e0e12",
        "primary-fixed-dim": "#39bce2",
        "secondary": "#ff6a9f",
        "tertiary-dim": "#4967f4",
        "on-background": "#f8f5fb",
        "inverse-primary": "#006880",
        "on-error": "#490013",
        "surface-variant": "#25252b",
        "on-secondary": "#470021",
        "secondary-fixed": "#ffc1d1",
        "tertiary-container": "#4967f4",
        "primary-container": "#21aed4",
        "surface-container-high": "#1f1f24",
        "primary-dim": "#39bce2",
        "background": "#0e0e12",
        "on-secondary-container": "#fff5f6",
        "inverse-on-surface": "#555459",
        "secondary-container": "#ba0060",
        "primary-fixed": "#4dc9f1",
        "surface-tint": "#4dc9f1"
      },
      borderRadius: {
        "DEFAULT": "0px",
        "lg": "0px",
        "xl": "0px",
        "full": "0px"
      },
      fontFamily: {
        "headline": ["'Space Grotesk'", "monospace"],
        "body": ["'Manrope'", "monospace"],
        "label": ["'Space Grotesk'", "monospace"],
        "pixel": ["'Press Start 2P'", "monospace"]
      }
    }
  }
}