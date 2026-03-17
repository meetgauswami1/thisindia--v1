/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#F97316',
        secondary: '#1E40AF',
        accent: '#FACC15',
        surface: '#FFF7ED',
        text: '#1F2937',
        darkbg: '#0F172A',
        darkcard: '#1E293B',
        darktext: '#E5E7EB',
      },
      boxShadow: {
        card: '0 12px 35px rgba(249, 115, 22, 0.15)',
        glow: '0 0 0 4px rgba(250, 204, 21, 0.2)',
      },
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(120deg, rgba(249,115,22,0.75), rgba(250,204,21,0.65), rgba(251,113,133,0.52))',
        'sunset-gradient': 'linear-gradient(100deg, #F97316 0%, #FB923C 45%, #FACC15 100%)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
