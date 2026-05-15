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
          DEFAULT: '#F2B544',
          light:   '#FFD36B',
          tint:    '#171717',
          dark:    '#C8922E',
        },
        trophy: {
          DEFAULT: '#F2B544',
          light:   '#FFD36B',
          tint:    '#171717',
          dark:    '#C8922E',
        },
        solana: {
          purple: '#9945FF',
          green:  '#14F195',
          tint:   '#171717',
        },
        live:    '#DC2626',
        page:    '#070707',
        surface: '#111111',
        subtle:  '#171717',
        ink: {
          DEFAULT: '#FFFFFF',
          soft:    '#B3B3B3',
          muted:   '#6E6E6E',
          faint:   '#6E6E6E',
        },
        line: {
          DEFAULT: '#2A2A2A',
          strong:  '#3A3A3A',
        },
      },
      backgroundImage: {
        'pitch-gradient':  'linear-gradient(135deg, #F2B544 0%, #FFD36B 100%)',
        'trophy-gradient': 'linear-gradient(135deg, #C8922E 0%, #F2B544 100%)',
        'solana-gradient': 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)',
        'hero-grass':      'linear-gradient(180deg, #070707 0%, #111111 100%)',
        'hero-radial':     'radial-gradient(ellipse at top, rgba(242,181,68,0.18) 0%, rgba(7,7,7,0) 60%)',
      },
      fontFamily: {
        sans:    ['Aptos', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Aptos Display', 'Aptos', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card:       '0 1px 3px rgba(0,0,0,0.28), 0 1px 2px rgba(0,0,0,0.22)',
        'card-hover':'0 12px 28px -6px rgba(0,0,0,0.38)',
        pop:        '0 20px 40px -8px rgba(242,181,68,0.16)',
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
