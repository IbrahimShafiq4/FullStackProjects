module.exports = {
    darkMode: 'class',
    content: ["./src/**/*.{html,ts}"],
    theme: {
        extend: {
            colors: { chat: { DEFAULT: '#0EA5E9' } },
            backgroundImage: { 'chat-bg': 'linear-gradient(160deg, #0F172A 0%, #1E293B 100%)' },
        },
    },
    plugins: [],
};