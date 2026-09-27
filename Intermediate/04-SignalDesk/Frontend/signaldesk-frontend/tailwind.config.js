module.exports = {
    darkMode: ['selector', '[data-theme="night"]'],
    content: ["./src/**/*.{html,ts}"],
    theme: {
        extend: {
            colors: {
                paper: 'var(--paper)',
                'paper-aged': 'var(--paper-aged)',
                ink: 'var(--ink)',
                'ink-blue': 'var(--ink-blue)',
                'ink-red': 'var(--ink-red)',
            },
        },
    },
    plugins: [],
};