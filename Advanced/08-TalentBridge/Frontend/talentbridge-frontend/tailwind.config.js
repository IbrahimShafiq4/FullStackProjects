module.exports = {
    darkMode: 'class',
    content: ['./src/**/*.{html,ts}'],
    theme: {
        extend: {
            colors: {
                paper: { DEFAULT: '#F1EEE7', 2: '#E6E1D6', 3: '#DAD4C6' },
                ink: { DEFAULT: '#14171A', 2: '#2B3036' },
                concrete: { DEFAULT: '#71767B', 2: '#A6A29A' },
                line: { DEFAULT: '#C7C1B4', 2: '#9E988C' },
                signal: { DEFAULT: '#C4391D', 2: '#A02D14' },
                route: {
                    blue: '#1C4A73',
                    green: '#2C6E4A',
                    amber: '#9B6700',
                    slate: '#4A5560',
                },
                'dk-paper': { DEFAULT: '#14171A', 2: '#1B1F23', 3: '#242830' },
                'dk-ink': { DEFAULT: '#F1EEE7', 2: '#D7D3C8' },
                'dk-concrete': '#8A8F94',
                'dk-line': { DEFAULT: '#2B3036', 2: '#3A4046' },
            },
            fontFamily: {
                display: ['"Space Grotesk"', '"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
                sans: ['"IBM Plex Sans Arabic"', '"Space Grotesk"', 'system-ui', 'sans-serif'],
                mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
            },
            letterSpacing: {
                'tracking-station': '0.18em',
                'tracking-code': '0.10em',
            },
            borderRadius: {
                none: '0', sharp: '2px', soft: '4px',
            },
            keyframes: {
                'route-draw': {
                    '0%': { strokeDashoffset: '1000' },
                    '100%': { strokeDashoffset: '0' },
                },
                'station-pulse': {
                    '0%, 100%': { transform: 'scale(1)', opacity: '1' },
                    '50%': { transform: 'scale(1.4)', opacity: '0.6' },
                },
                'toast-in': {
                    '0%': { transform: 'translateY(-16px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
            animation: {
                'route-draw': 'route-draw 1.6s cubic-bezier(.65,0,.35,1) forwards',
                'station-pulse': 'station-pulse 2s ease-in-out infinite',
                'toast-in': 'toast-in 220ms cubic-bezier(.2,.9,.3,1) both',
            },
        },
    },
    plugins: [],
};