module.exports = {
    content: ['./src/**/*.{html,ts}'],
    darkMode: ['class', '[data-theme="dark"]'],
    theme: {
        extend: {
            colors: {
                papyrus: '#F1E8D2',
                paper: '#FAF6EA',
                ink: '#181714',
                blue: { DEFAULT: '#24566A', dark: '#1A4254' },
                bronze: { DEFAULT: '#9A7444', dark: '#7A5A33' },
                red: { DEFAULT: '#8E2F28', dark: '#6B1F1A' },
            },
            fontFamily: {
                display: ['"Aref Ruqaa"', 'Amiri', 'serif'],
                headline: ['Amiri', 'serif'],
                body: ['"Noto Naskh Arabic"', 'serif'],
                sans: ['"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
        },
    },
    plugins: [],
};