/** @type { import('tailwindcss').Config } */
module.exports = {
    darkMode: 'class',
    content: ["./src/**/*.{html,ts}"],
    theme: {
        extend: {
            colors: {
                neon: '#00D9A3',
            },
            fontFamily: {
                mono: ['"JetBrains Mono"', 'monospace'],
            },
        },
    },
    plugins: [],
}