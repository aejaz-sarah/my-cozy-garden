/**
 * tailwind.config.js
 * ─────────────────────────────────────────────────────────────────────────────
 * NOTE: Tailwind CSS v4 uses a CSS-first configuration model.
 * Most configuration is done directly in CSS via @theme directives.
 * This file exists for tooling compatibility (IDE IntelliSense, plugins).
 *
 * See: src/index.css for the actual @theme token definitions.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind v4 auto-detects content — explicit list for clarity
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    extend: {
      // ── Cozy Garden Design Tokens ─────────────────────────────────────────
      colors: {
        // Pastel sunset palette
        'petal-pink':    '#f5a0c0',
        'lavender-mist': '#c9b3e8',
        'sky-rose':      '#f8c8d8',
        'meadow-green':  '#7bc47f',
        'deep-grass':    '#3d7a45',
        'golden-hour':   '#f9d87a',
        'twilight-blue': '#6b7fc4',
        'bark-brown':    '#8b6543',
        // HUD palette
        'hud-bg':        'rgba(255, 235, 245, 0.92)',
        'hud-border':    '#e890b8',
        'hud-text':      '#4a2040',
        'hud-accent':    '#d44090',
      },

      fontFamily: {
        pixel:  ['"Press Start 2P"', 'monospace'],
        cozy:   ['"Nunito"', 'sans-serif'],
        body:   ['"Inter"', 'sans-serif'],
      },

      boxShadow: {
        'cozy-sm':  '4px 4px 0px #d44090',
        'cozy-md':  '6px 6px 0px #d44090',
        'cozy-lg':  '8px 8px 0px #b03070',
        'glow-pink': '0 0 20px rgba(213, 64, 144, 0.4)',
      },

      borderRadius: {
        'pixel': '0px',
        'cozy':  '12px',
        'pill':  '9999px',
      },

      animation: {
        'float':        'float 3s ease-in-out infinite',
        'petal-fall':   'petalFall 2s ease-in forwards',
        'harvest-flash': 'harvestFlash 0.8s steps(2) forwards',
        'slide-up':     'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'bob':          'bob 2s ease-in-out infinite',
        'sparkle':      'sparkle 1.5s ease-in-out infinite',
        'mote-drift':   'moteDrift 8s ease-in-out infinite',
      },

      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        bob: {
          '0%, 100%': { transform: 'translateY(0px) scaleY(1)' },
          '50%':      { transform: 'translateY(-4px) scaleY(1.02)' },
        },
        petalFall: {
          '0%':   { transform: 'translateY(-20px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(110vh) rotate(720deg)', opacity: '0' },
        },
        harvestFlash: {
          '0%':   { filter: 'brightness(1)' },
          '50%':  { filter: 'brightness(3) saturate(0)' },
          '100%': { filter: 'brightness(1)' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.8)' },
          '50%':      { opacity: '1',   transform: 'scale(1.2)' },
        },
        moteDrift: {
          '0%':   { transform: 'translateY(0)   translateX(0)   opacity: 0.6' },
          '50%':  { transform: 'translateY(-40px) translateX(20px)' },
          '100%': { transform: 'translateY(0)   translateX(0)' },
        },
      },
    },
  },

  plugins: [],
};
