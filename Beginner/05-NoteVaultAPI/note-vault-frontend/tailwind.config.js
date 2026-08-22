/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',

    content: [
        "./src/**/*.{html,ts}",
    ],

    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                },
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
            animation: {
                fadeIn: 'fadeIn 0.2s ease-in-out',
            },
        },
    },

    plugins: [],
};