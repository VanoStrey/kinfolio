/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'surface-soft': 'var(--color-surface-soft)',
        'surface-green': 'var(--color-surface-green)',
        'surface-subtle': 'var(--color-surface-soft)',

        primary: 'var(--color-text-primary)',
        secondary: 'var(--color-text-secondary)',
        muted: 'var(--color-text-muted)',
        inverse: 'var(--color-text-inverse)',

        green: {
          900: 'var(--color-green-900)',
          700: 'var(--color-green-700)',
          600: 'var(--color-green-600)',
          300: 'var(--color-green-300)',
          100: 'var(--color-green-100)',
        },

        accent: {
          DEFAULT: 'var(--color-green-100)',
          hover: 'var(--color-green-300)',
          dark: 'var(--color-green-900)',
          soft: 'var(--color-surface-soft)',
        },

        border: {
          subtle: 'var(--color-border)',
          DEFAULT: 'var(--color-border)',
          strong: 'var(--color-green-300)',
        },

        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        info: 'var(--color-info)',

        status: {
          idea: '#F0F3EB',
          bought: '#EAF0F2',
          given: '#E8EEE4',
          archived: '#EFEFEA',
          danger: '#FAF0EF',
          'danger-text': '#B76E67',
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
        display: [
          '"Plus Jakarta Sans"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        subtle: 'var(--shadow-soft)',
        soft: 'var(--shadow-soft)',
        card: '0 4px 16px rgba(41, 46, 41, 0.05)',
        modal: 'var(--shadow-modal)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        DEFAULT: 'var(--radius-md)',
      },
    },
  },
  plugins: [],
};
