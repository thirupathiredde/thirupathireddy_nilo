/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        dyslexic: ['var(--font-dyslexic)', 'var(--font-sans)', 'sans-serif'],
      },
      spacing: {
        dense: 'var(--layout-density, 0.75rem)',
        comfortable: 'var(--layout-comfortable, 1rem)',
        relaxed: 'var(--layout-relaxed, 1.5rem)',
      },
    },
  },
  plugins: [],
};
