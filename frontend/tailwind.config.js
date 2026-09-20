/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Industry-Grade Cyber Command Center Surface Tokens
        command: {
          950: '#060911', // Deepest background canvas
          900: '#0a0e1a', // Primary app container
          850: '#0f1424', // Panels, Header, Sidebar
          800: '#141b30', // Cards, drawers, modal surface
          750: '#1a233d', // Elevated surface, hover state
          700: '#222d4d', // Active/selected state
          600: '#334166', // Subtle dividers / outlines
        },
        // Cyber Neon Semantic Accents
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        rose: {
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        purple: {
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
        },
        primary: {
          DEFAULT: '#06b6d4',
          hover: '#0891b2',
          glow: 'rgba(6, 182, 212, 0.4)',
        },
        "threat-crimson": "#f43f5e",
        "threat-crimson-dark": "#be123c",
        "risk-amber": "#fbbf24",
        "verified-emerald": "#10b981",
        "ai-purple": "#a855f7",
        "ai-purple-light": "#c084fc",
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        "label-sm": ["JetBrains Mono", "monospace"],
        "label-md": ["JetBrains Mono", "monospace"],
        "label-lg": ["JetBrains Mono", "monospace"],
        "headline-sm": ["Outfit", "Inter", "sans-serif"],
        "headline-md": ["Outfit", "Inter", "sans-serif"],
        "headline-lg": ["Outfit", "Inter", "sans-serif"],
        "headline-xl": ["Outfit", "Inter", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.3)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.4)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -4px rgba(0, 0, 0, 0.4)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.85)',
        'glow-cyan': '0 0 25px -3px rgba(6, 182, 212, 0.45)',
        'glow-rose': '0 0 25px -3px rgba(244, 63, 94, 0.45)',
        'glow-amber': '0 0 25px -3px rgba(251, 191, 36, 0.45)',
        'glow-emerald': '0 0 25px -3px rgba(16, 185, 129, 0.45)',
        'glow-purple': '0 0 30px -4px rgba(168, 85, 247, 0.45)',
        'inner-glow': 'inset 0 0 15px 0 rgba(6, 182, 212, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radar 4s linear infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
