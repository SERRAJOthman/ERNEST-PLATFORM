/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0a1628', // Navy gradient start
                'background-end': '#1a2332', // Navy gradient end
                primary: {
                    DEFAULT: '#00d9ff', // Cyan/Aqua
                    glow: 'rgba(0, 217, 255, 0.5)',
                },
                success: '#00ff94',
                warning: '#ffb800',
                danger: '#ff4757',
                text: {
                    primary: '#ffffff',
                    secondary: '#8892a6',
                }
            },
            fontFamily: {
                sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'shimmer': 'shimmer 2s linear infinite',
            },
            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' }
                }
            }
        },
    },
    plugins: [],
}
