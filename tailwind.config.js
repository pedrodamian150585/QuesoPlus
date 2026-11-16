/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './frontend/index.html',
    './frontend/src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        qp: {
          canvas: '#04070C',
          sidebar: '#02050B',
          topbar: '#06080E',
          card: '#0D1017',
          cardElevated: '#141824',
          border: '#1B1F29',
          red: '#E11D2E',
          redDark: '#A80212',
          gold: '#F59E0B',
          amber: '#CF8004',
          green: '#10B981',
          emerald: '#05972E',
          blue: '#0EA5E9',
          blueDark: '#0567C0',
          purple: '#8B5CF6',
          violet: '#7C3AED',
          textPrimary: '#FFFFFF',
          textSecondary: '#94A3B8',
          textMuted: '#64748B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        script: ['Caveat', 'Dancing Script', 'cursive']
      },
      boxShadow: {
        'qp-card': '0 8px 28px rgba(0, 0, 0, 0.55)',
        'qp-red-glow': '0 0 20px rgba(225, 29, 46, 0.42)',
        'qp-amber-glow': '0 0 18px rgba(245, 158, 11, 0.35)',
        'qp-green-glow': '0 0 18px rgba(16, 185, 129, 0.35)',
        'qp-blue-glow': '0 0 18px rgba(14, 165, 233, 0.35)',
        'qp-purple-glow': '0 0 18px rgba(139, 92, 246, 0.35)'
      }
    }
  },
  plugins: []
}
