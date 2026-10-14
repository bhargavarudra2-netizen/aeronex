/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          main: '#F4F5F9',        // Soft subtle gray SaaS page canvas background like reference
          secondary: '#FFFFFF',   // Pure white for cards and floating containers
          card: '#FFFFFF',        // Clean white card surfaces
          elevated: '#FFFFFF',
          panel: '#FFFFFF',
          soft: '#EDEDF4',        // Gentle divider / pill fill
        },
        brand: {
          orange: '#FF5722',       // Vibrant energetic orange CTA from reference
          orangeHover: '#F44336',  // Hover state
          orangeLight: '#FFF2EC',  // Soft orange pill / badge highlight
          dark: '#16171B',         // Deep obsidian black typography
          gray: '#5E616B',         // Neutral secondary text
          border: '#E3E4EB',       // Crisp delicate card outline
          lavender: '#7667C2',     // AirControl signature muted lavender/periwinkle
          lavenderLight: '#F3F1FA',// Soft lavender pill tint
          lavenderBorder: '#D8D4EE',// Lavender subtle border
        },
        accent: {
          primary: '#FF5722',
          secondary: '#7667C2',
          lavender: '#E9E6F7',
        },
        text: {
          primary: '#16171B',
          secondary: '#5E616B',
          muted: '#8F93A0',
        },
        border: {
          subtle: '#E3E4EB',
          muted: '#ECEEF3',
          active: '#FF5722',
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#7667C2',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        card: '0 2px 8px -2px rgba(22, 23, 27, 0.04), 0 1px 3px 0 rgba(22, 23, 27, 0.02)',
        cardHover: '0 16px 32px -8px rgba(22, 23, 27, 0.08), 0 4px 12px -2px rgba(22, 23, 27, 0.03)',
        floating: '0 20px 40px -12px rgba(22, 23, 27, 0.1), 0 1px 3px 0 rgba(22, 23, 27, 0.05)',
        orangeGlow: '0 6px 20px -4px rgba(255, 87, 34, 0.35)',
        pill: '0 2px 6px 0 rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}
