import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#003E78',
          light: '#0041C2',
          dark: '#042C46',
          50: '#E6EEF7',
          100: '#C2D4EC',
          200: '#9BB8DE',
          300: '#749CD0',
          400: '#4D80C2',
          500: '#003E78',
          600: '#003562',
          700: '#002B4C',
          800: '#042C46',
          900: '#042040',
        },
        secondary: {
          DEFAULT: '#383843',
          light: '#4D4D5A',
          dark: '#2A2A33',
          50: '#ECECF0',
          100: '#D9DED9',
          200: '#B8BCB8',
          300: '#979997',
          400: '#757575',
          500: '#383843',
          600: '#2F2F38',
          700: '#26262C',
          800: '#1D1D22',
          900: '#141418',
        },
        accent: {
          DEFAULT: '#0041C2',
          light: '#2563EB',
          dark: '#003E78',
        },
        background: '#F9F4F8',
        surface: {
          DEFAULT: '#FFFFFF',
          elevated: '#F2F2F2',
          background: '#F9F4F8',
        },
        foreground: '#383843',
        muted: {
          DEFAULT: '#F2F2F2',
          foreground: '#757575',
        },
        border: '#D9DED9',
        destructive: '#DC2626',
        success: '#16A34A',
        warning: '#F59E0B',
        info: '#0041C2',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(56, 56, 67, 0.08)',
        'card-hover': '0 4px 12px rgba(56, 56, 67, 0.12)',
        'dropdown': '0 4px 16px rgba(56, 56, 67, 0.1)',
      },
      borderRadius: {
        'xl': '1.5rem',
        '2xl': '2rem',
      }
    },
  },
  plugins: [],
}
export default config