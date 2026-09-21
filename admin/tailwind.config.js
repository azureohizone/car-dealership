/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        legendary: {
          dark: '#0a0a0d',
          darker: '#060608',
          card: '#121217',
          cardHover: '#181820',
          border: '#242430',
          borderLight: '#323242',
          red: '#e50914',
          redHover: '#f40612',
          redGlow: 'rgba(229, 9, 20, 0.35)',
          crimson: '#990000',
          gold: '#eab308',
          goldGlow: 'rgba(234, 179, 8, 0.25)',
          gray: '#9ca3af',
          light: '#f3f4f6'
        }
      },
      fontFamily: {
        display: ['"Montserrat"', '"Orbitron"', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'carbon-pattern': "radial-gradient(#1c1c24 1px, transparent 1px), radial-gradient(#1c1c24 1px, #0a0a0d 1px)",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'motorsport-stripe': 'repeating-linear-gradient(45deg, rgba(229,9,20,0.1) 0, rgba(229,9,20,0.1) 10px, transparent 10px, transparent 20px)'
      },
      boxShadow: {
        'red-glow': '0 0 25px rgba(229, 9, 20, 0.35)',
        'red-glow-lg': '0 0 45px rgba(229, 9, 20, 0.55)',
        'gold-glow': '0 0 25px rgba(234, 179, 8, 0.35)',
        'card-elevated': '0 10px 30px -5px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.05)'
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
