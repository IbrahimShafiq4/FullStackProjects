module.exports = {
    darkMode: 'class',
    content: ["./src/**/*.{html,ts}"],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#f0f7ff',
                    100: '#e0efff',
                    200: '#b8d9ff',
                    300: '#8ac3ff',
                    400: '#5aadff',
                    500: '#2b8cff',
                    600: '#1a6fd9',
                    700: '#1054b3',
                    800: '#0a3b8c',
                    900: '#052666',
                },
                surface: {
                    DEFAULT: '#ffffff',
                    muted: '#f8fafc',
                    subtle: '#f1f4f9',
                    border: '#e9edf2',
                }
            },
            fontFamily: {
                sans: ['Cairo', 'sans-serif'],
            },
            boxShadow: {
                'apple': '0 1px 3px rgba(0,0,0,0.04), 0 8px 30px rgba(0,0,0,0.04)',
                'apple-lg': '0 1px 3px rgba(0,0,0,0.02), 0 20px 60px rgba(0,0,0,0.06)',
                'apple-xl': '0 1px 3px rgba(0,0,0,0.01), 0 40px 80px rgba(0,0,0,0.08)',
            },
            borderRadius: {
                'lg': '0.75rem',
                'xl': '1rem',
                '2xl': '1.25rem',
            },
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
            },
            maxWidth: {
                '8xl': '88rem',
                '9xl': '96rem',
            }
        },
    },
    plugins: [],
};