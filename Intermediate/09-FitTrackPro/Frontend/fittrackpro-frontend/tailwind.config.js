/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ["./src/**/*.{html,ts}"],
    theme: {
        extend: {
            colors: { pulse: { DEFAULT: '#EF4444' } },
        },
    },
    plugins: [],
};