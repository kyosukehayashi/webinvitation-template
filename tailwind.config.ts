import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        base: '#F8F4EF',
        surface: '#FFFDF8',
        accent: {
          DEFAULT: '#B76D68',
          hover: '#A25751',
          light: '#F4E3DF',
        },
        ink: {
          primary: '#1F1D1B',
          muted: '#6E655F',
        },
        text: {
          primary: '#2C2520',
          secondary: '#6C635C',
          muted: '#A0948A',
        },
        line: '#E5DAD1',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'serif'],
      },
      fontSize: {
        'hero-title': ['clamp(2.5rem, 5vw, 3.5rem)', { lineHeight: '1.2' }],
        'section-title': ['clamp(1.75rem, 3vw, 2.25rem)', { lineHeight: '1.3' }],
        'body': ['1rem', { lineHeight: '1.8' }],
        'display': ['clamp(3rem, 6vw, 4.5rem)', { lineHeight: '1.1' }],
      },
      spacing: {
        'section': '8rem',
        'section-sm': '4rem',
      },
      boxShadow: {
        floating: '0 25px 45px rgba(47, 32, 24, 0.08)',
        ring: '0 0 0 1px rgba(32, 24, 20, 0.05)',
      },
      borderRadius: {
        subtle: '1rem',
      },
      letterSpacing: {
        relaxed: '.25em',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
