module.exports = {
    darkMode: 'class',
    content: ["./src/**/*.{html,ts}"],
    theme: {
        extend: {
            colors: { stream: { DEFAULT: '#7C3AED' } },
            backgroundImage: { 'stream-hero': 'linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)' },
        },
    },
    plugins: [],
};