import type { Config } from 'tailwindcss';
import { screens, fontFamily } from 'tailwindcss/defaultTheme';

const config = {
    darkMode: ['class'],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}'
    ],
    prefix: '',
    future: {
        hoverOnlyWhenSupported: true
    },
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '3xl': '1536px'
            }
        },
        screens: {
            xs: '290px',
            '2xs': '475px',
            ...screens,
            '3xl': '1536px'
        },
        extend: {
            fontFamily: {
                sans: ['var(--font-sans)', ...fontFamily.sans]
            },
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                    brand: 'hsl(var(--brand))',
                    'brand-blue': 'hsl(var(--brand-blue))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'hsl(transparent)',
                    foreground: 'hsl(var(--card-foreground))'
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                },
                'loop-scroll': {
                    from: { transform: 'translateX(0)' },
                    to: { transform: 'translateX(-400%)' }
                }
            },
            animation: {
                'loop-scroll': 'loop-scroll 120s linear infinite',
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out'
            },
            boxShadow: {
                'border-extension': '0 0 0 1px hsl(var(--border))'
            },
            rotate: {
                '20': '20deg'
            }
        }
    },
    plugins: [require('tailwindcss-animate')]
} satisfies Config;

export default config;
