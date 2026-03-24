/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    typography: require('./typography'),
    extend: {
      colors: {
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2A37',
          900: '#111928',
          950: '#030712',
        },
        primary: {
          50: '#f0eefb',
          100: '#e0dcf7',
          200: '#c1b9ef',
          300: '#a89df0',
          400: '#8a7de5',
          500: '#7b6fe0',
          600: '#665cd7',
          700: '#5a51c4',
          800: '#4a42a3',
          900: '#3a3482',
        },
        brand: {
          purple: '#665cd7',
          'purple-light': '#a89df0',
          'purple-deep': '#5248c8',
          'dark-bg': '#242438',
          'dark-navy': '#2b2a35',
        },
        green: {
          50: '#F3FAF7',
          100: '#DEF7EC',
          800: '#03543F',
        },
        yellow: {
          100: '#FDF6B2',
          800: '#723B13',
        },
      },
      screens: {
        mobile: '100px',
        tablet: '640px',
        pc: '769px',
      },
      fontFamily: {
        display: ['Raleway', 'sans-serif'],
        body: ['Lato', 'sans-serif'],
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'pulse-dot': 'pulse-dot 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
