/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F7F7F4',
        surface: '#FFFFFF',
        'surface-subtle': '#FAF9F6',
        primary: '#242623',
        secondary: '#8B9088',
        muted: '#A5AAA0',
        accent: {
          DEFAULT: '#DCE5DB',
          hover: '#CDD9CC',
          dark: '#3E4C3E',
          soft: '#EEF3EE',
        },
        border: {
          subtle: '#E8E8E3',
          DEFAULT: '#DEDED7',
          strong: '#C2C2B8',
        },
        status: {
          idea: '#EBEFEB',
          bought: '#E3E9F1',
          given: '#E1EFE6',
          archived: '#EDEDEA',
          danger: '#FBEBEB',
          'danger-text': '#B33A3A',
        },
      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        modal: '0 8px 30px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        DEFAULT: '6px',
        sm: '4px',
        md: '8px',
        lg: '10px',
        xl: '14px',
      },
    },
  },
  plugins: [],
};
