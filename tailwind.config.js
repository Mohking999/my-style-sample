/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FBFBF9',
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#F6F6F2',
          muted: '#EFEFEA',
        },
        primary: {
          DEFAULT: '#111111',
          hover: '#2A2A2A',
          foreground: '#FFFFFF',
        },
        forest: {
          50: '#F2F7F4',
          100: '#E1EDE6',
          500: '#235338',
          700: '#163323',
          800: '#0E2317',
          900: '#08170E',
        },
        algerian: {
          50: '#FDF2F2',
          100: '#FCE4E4',
          500: '#C42B24',
          600: '#A81F19',
          700: '#8A1510',
        },
        heritage: {
          gold: '#C5A059',
          sand: '#E6D7C3',
          olive: '#4A5B45',
          terracotta: '#B85D3D',
        },
        border: {
          DEFAULT: '#E5E5E0',
          subtle: '#F0F0EB',
          dark: '#262626',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        arabic: ['"Cairo"', '"Noto Naskh Arabic"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
        'elevated': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
        'card': '0 4px 20px -2px rgba(17, 17, 17, 0.05)',
      },
      aspectRatio: {
        'product': '4 / 5',
      },
    },
  },
  plugins: [],
}
