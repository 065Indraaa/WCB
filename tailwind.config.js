/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pitch: {
          DEFAULT: '#15803D',
          light:   '#22C55E',
          tint:    '#DCFCE7',
          dark:    '#14532D',
        },
        trophy: {
          DEFAULT: '#D97706',
          light:   '#F59E0B',
          tint:    '#FEF3C7',
          dark:    '#92400E',
        },
        solana: {
          purple: '#7C3AED',
          green:  '#14F195',
          tint:   '#EDE9FE',
        },
        live:    '#DC2626',
        page:    '#FAFBF8',
        surface: '#FFFFFF',
        subtle:  '#F1F5F0',
        ink: {
          DEFAULT: '#0F172A',
          soft:    '#334155',
          muted:   '#64748B',
          faint:   '#94A3B8',
        },
        line: {
          DEFAULT: '#E2E8F0',
          strong:  '#CBD5E1',
        },
      },
      backgroundImage: {
        'pitch-gradient':  'linear-gradient(135deg, #15803D 0%, #22C55E 100%)',
        'trophy-gradient': 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
        'solana-gradient': 'linear-gradient(135deg, #7C3AED 0%, #14F195 100%)',
        'hero-grass':      'linear-gradient(180deg, #FAFBF8 0%, #DCFCE7 100%)',
        'hero-radial':     'radial-gradient(ellipse at top, rgba(34,197,94,0.18) 0%, rgba(250,251,248,0) 60%)',
      },
      fontFamily: {
        sans:    ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'Space Grotesk', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card:       '0 1px 3px rgba(15,23,42,0.05), 0 1px 2px rgba(15,23,42,0.04)',
        'card-hover':'0 12px 28px -6px rgba(15,23,42,0.10)',
        pop:        '0 20px 40px -8px rgba(21,128,61,0.15)',
      },
      animation: {
        marquee:        'marquee 35s linear infinite',
        'live-pulse':   'live-pulse 1.4s ease-in-out infinite',
        'subtle-bounce':'subtle-bounce 2s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'live-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.45', transform: 'scale(1.3)' },
        },
        'subtle-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-4px)' },
        },
      },
    },
  },
  plugins: [],
};
