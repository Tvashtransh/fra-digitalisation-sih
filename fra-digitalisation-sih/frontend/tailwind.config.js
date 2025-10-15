module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'heading': 'var(--color-heading)',
        'numbering': 'var(--color-numbering)',
        'bg-heading': 'var(--color-bg-heading)',
        'fra-font': 'var(--color-font)',
        'bg-1': 'var(--color-bg-1)',
        'bg-2': 'var(--color-bg-2)',
      },
    },
  },
  plugins: [],
}