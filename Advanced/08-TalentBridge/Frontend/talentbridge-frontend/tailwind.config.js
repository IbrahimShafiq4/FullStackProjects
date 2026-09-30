module.exports = {
    darkMode: 'class',
    content: ["./src/**/*.{html,ts}"],
    theme: {
        extend: {
            colors: { bridge: { DEFAULT: '#1D4ED8' } },
            backgroundImage: { 'bridge-hero': 'linear-gradient(135deg, #1D4ED8 0%, #1E1B4B 100%)' },
        },
    },
    plugins: [],
};