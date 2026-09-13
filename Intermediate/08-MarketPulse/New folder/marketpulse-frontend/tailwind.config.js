/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ["./src/**/*.{html,ts}"],
    theme: {
        extend: {
            colors: {
                amber: { DEFAULT: '#F59E0B' },
            },
        },
    },
    plugins: [],
};