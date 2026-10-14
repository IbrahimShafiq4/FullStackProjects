module.exports = {
    darkMode: 'class',

    content: ['./src/**/*.{html,ts}'],

    theme: {
        extend: {
            colors: {
                twitter: { DEFAULT: '#1D9BF0', dark: '#0C4A6E' },
                facebook: { DEFAULT: '#1877F2', dark: '#0D2A5C' },
                instagram: { DEFAULT: '#E4405F', purple: '#833AB4', gold: '#FCAF45' },

                'fb-ig': '#7C3AED',
                'fb-twitter': '#0EA5E9',
                'ig-twitter': '#F43F5E',
                premium: { DEFAULT: '#A855F7', pink: '#EC4899', amber: '#F59E0B' },
                'triple-premium': '#F59E0B',
            },

            backgroundImage: {
                'twitter-gradient': 'linear-gradient(135deg, #1D9BF0 0%, #0C4A6E 100%)',
                'facebook-gradient': 'linear-gradient(135deg, #1877F2 0%, #0D2A5C 100%)',
                'instagram-gradient': 'linear-gradient(135deg, #E4405F 0%, #833AB4 50%, #FCAF45 100%)',
                'fb-ig-gradient': 'linear-gradient(135deg, #1877F2 0%, #833AB4 50%, #E4405F 100%)',
                'fb-twitter-gradient': 'linear-gradient(135deg, #1877F2 0%, #1D9BF0 100%)',
                'ig-twitter-gradient': 'linear-gradient(135deg, #E4405F 0%, #1D9BF0 100%)',
                'premium-gradient': 'linear-gradient(135deg, #A855F7 0%, #EC4899 50%, #F59E0B 100%)',
                'triple-premium-gradient': 'linear-gradient(135deg, #F59E0B 0%, #EC4899 35%, #7C3AED 70%, #1D9BF0 100%)',
            },

            fontFamily: {
                sans: ['"IBM Plex Sans Arabic"', 'Inter', 'system-ui', 'sans-serif'],
            },

            keyframes: {
                'toast-in': {
                    from: { opacity: '0', transform: 'translateY(-20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                'gradient-shift': {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                'pulse-ring': {
                    '0%': { opacity: '0.8', transform: 'scale(1)' },
                    '100%': { opacity: '0', transform: 'scale(1.4)' },
                },
                'float-up': {
                    '0%': { opacity: '1', transform: 'translateY(0) scale(0.5)' },
                    '20%': { transform: 'translateY(-40px) scale(1.2)' },
                    '100%': { opacity: '0', transform: 'translateY(-320px) scale(1)' },
                },
                'fade-in': {
                    from: { opacity: '0', transform: 'translateY(5px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
            },
            animation: {
                'toast-in': 'toast-in 0.3s ease-out',
                'gradient-shift': 'gradient-shift 4s ease infinite',
                'pulse-ring': 'pulse-ring 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float-up': 'float-up 3s ease-out forwards',
                'fade-in': 'fade-in 0.3s ease',
            },
        },
    },

    plugins: [],
};