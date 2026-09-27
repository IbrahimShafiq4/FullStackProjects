module.exports = {
    darkMode: ['selector', '[data-theme="dark"]'],
    content: ["./src/**/*.{html,ts}"],
    theme: {
        extend: {
            colors: {
                'cc-bg': 'var(--bg-base)',
                'cc-panel': 'var(--bg-panel)',
                'cc-panel-2': 'var(--bg-panel-soft)',
                'cc-elevated': 'var(--bg-elevated)',
                'cc-border': 'var(--border-hair)',
                'cc-fg': 'var(--fg-base)',
                'cc-fg-soft': 'var(--fg-soft)',
                'cc-muted': 'var(--fg-muted)',
                'cc-accent': 'var(--accent)',
                'cc-gold': 'var(--gold)',
                'cc-nile': 'var(--nile)',
                'cc-ok': 'var(--ok)',
                'cc-err': 'var(--err)',
            },
            fontFamily: {
                display: ['"Aref Ruqaa"', 'serif'],
                headline: ['"Amiri"', 'serif'],
                body: ['"IBM Plex Sans Arabic"', 'sans-serif'],
                cairo: ['"Cairo"', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
        },
    },
    plugins: [],
};